# habits/serializers.py
from rest_framework import serializers
from .models import User, Habit, HabitLog

# Сериализатор для пользователей
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}  # Пароль только для записи

    def create(self, validated_data):
        # Создаем нового пользователя, хешируя пароль
        user = User.objects.create_user(**validated_data)
        return user


# Сериализатор для привычек
class HabitSerializer(serializers.ModelSerializer):
    class Meta:
        model = Habit
        fields = ['id', 'user', 'title', 'period']

    def validate_user(self, value):
        if isinstance(value, int):
            return value
        raise serializers.ValidationError("Invalid user ID.")
    

# Сериализатор для логов выполнения привычек
class HabitLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = HabitLog
        fields = ['id', 'habit', 'date', 'status']

