from django.urls import path
from .views import UserView, HabitView, HabitLogView , TokenObtainView

urlpatterns = [
    path('users/', UserView.as_view(), name='user-create'),
    path('habits/', HabitView.as_view(), name='habit-create'),
    path('habits/<int:habit_id>/logs/', HabitLogView.as_view(), name='habit-log'),
    path('token/', TokenObtainView.as_view(), name='token-obtain'),
]