from django.db import models
from django.contrib.auth.models import AbstractUser , Group, Permission

# Класс пользователя
class User(AbstractUser):
    pass

# Класс для привычек
class Habit(models.Model):
    PERIOD_CHOICES = [
        ('daily', 'Ежедневно'),
        ('weekly', 'Еженедельно'),
    ]
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='habits')
    title = models.CharField(max_length=255)
    period = models.CharField(max_length=10, choices=PERIOD_CHOICES)

    def __str__(self):
        return self.title


# Класс для отслеживания выполнения привычек
class HabitLog(models.Model):
    habit = models.ForeignKey(Habit, on_delete=models.CASCADE, related_name='logs')
    date = models.DateField()
    status = models.BooleanField(default=False)  # True, если привычка выполнена

    def __str__(self):
        return f"{self.habit.title} - {self.date} - {'Completed' if self.status else 'Not Completed'}"
