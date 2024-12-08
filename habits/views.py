# habits/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from .models import User, Habit, HabitLog
from .serializers import UserSerializer, HabitSerializer, HabitLogSerializer
from django.shortcuts import get_object_or_404
from datetime import date
from django.shortcuts import render
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from rest_framework.permissions import IsAuthenticated


def index(request):
    return render(request, 'habits/index.html')

class TokenObtainView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(email=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'access': str(refresh.access_token),
            })
        return Response({"detail": "Неверные данные для входа."}, status=status.HTTP_400_BAD_REQUEST)

# Добавление пользователей
class UserView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

# Добавление привычек
class HabitView(APIView):
    def post(self, request):
        # Создаем привычку для пользователя
        serializer = HabitSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()  # Сохраняем привычку в базе
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Логи выполнения привычек
class HabitLogView(APIView):
    def post(self, request, habit_id):
        habit = get_object_or_404(Habit, id=habit_id)
        data = request.data.copy()
        data['habit'] = habit.id  # Устанавливаем привычку в лог

        serializer = HabitLogSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def get(self, request, habit_id):
        habit = get_object_or_404(Habit, id=habit_id)
        logs = habit.logs.all()
        serializer = HabitLogSerializer(logs, many=True)
        return Response(serializer.data)
    
class HabitView(APIView):
    permission_classes = [IsAuthenticated]  # Только авторизованные пользователи могут добавлять привычки

    def post(self, request):
        user = request.user  # Берем текущего авторизованного пользователя
        data = request.data.copy()
        data['user'] = user.id  # Привязываем привычку к текущему пользователю

        serializer = HabitSerializer(data=data)
        if serializer.is_valid():
            serializer.save(user=user)  # Привязываем пользователя к привычке
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
