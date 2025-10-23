from rest_framework import serializers
from .models import CustomUser
from django.contrib.auth import get_user_model

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    is_admin = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id','username','email','profile_image','is_admin']

    def get_is_admin(self, obj):
        return getattr(obj, 'is_admin',False) or obj.is_staff or obj.is_superuser


# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = ['username','email','password','profile_image']
#         extra_kwargs = {'password':{'write_only':True}}

    

#     def create(self, validated_data):
#         password = validated_data.pop('password')
#         user = User.objects.create_user(**validated_data)
#         user.set_password(password)
#         user.save()
#         return user


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username','email','password']  # Removed profile_image
        extra_kwargs = {'password':{'write_only':True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user