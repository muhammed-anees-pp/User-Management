from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView,TokenRefreshView


urlpatterns = [
    path('register/',views.RegisterView.as_view()),
    path('login/',TokenObtainPairView.as_view()),
    path('token/refresh/',TokenObtainPairView.as_view()),
    path('',views.UserListView.as_view()),
    path('me/', views.MeView.as_view()),
    path('<int:pk>/',views.UserDetailView.as_view()),
    path('me/profile-image/', views.ProfileImageView.as_view(), name='profile-image'),  # Add this
]