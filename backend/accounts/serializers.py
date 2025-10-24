from rest_framework import serializers
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.password_validation import validate_password
from .models import CustomUser

User = get_user_model()

class RegisterSerializers(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password],min_length=8)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')
        
    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already taken")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class ProfileSerializers(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_admin', 'profile_image']

    def get_is_admin(self, obj):
        return obj.is_superuser


class LoginSerializers(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            raise serializers.ValidationError('Both username and password are required!')

        user = authenticate(username=username, password=password)
        if not user:
            raise serializers.ValidationError('Invalid username or password')

        refresh = RefreshToken.for_user(user)

        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'is_admin': user.is_superuser or user.is_staff
        }

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)
    is_admin = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile_image', 'password', 'is_superuser', 'is_staff', 'is_admin']
        read_only_fields = ['is_superuser', 'is_staff', 'is_admin']
    
    def get_is_admin(self, obj):
        return obj.is_superuser or obj.is_staff or obj.is_admin

    def validate_email(self, value):
        instance = getattr(self, 'instance', None)
        
        if instance and instance.email == value:
            return value
            
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email already taken")
        return value

    def validate_username(self, value):
        instance = getattr(self, 'instance', None)
        
        if instance and instance.username == value:
            return value
            
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("Username already taken")
        return value

    def create(self, validated_data):
        password = validated_data.pop('password', None)
        user = User(**validated_data)
        if password:
            user.set_password(password)
        user.save()
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)
        return super().update(instance, validated_data)