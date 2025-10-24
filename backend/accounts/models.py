from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    is_admin = models.BooleanField(default=False)
    profile_image = models.ImageField(upload_to='profile_image/',null=True,blank=True)
    