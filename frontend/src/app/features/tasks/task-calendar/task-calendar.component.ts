import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterLink } from '@angular/router';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-calendar',
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatTooltipModule,
    FormsModule
  ],
  templateUrl: './task-calendar.component.html',
  styleUrls: ['./task-calendar.component.scss']
})
export class TaskCalendarComponent {
  private taskService = inject(TaskService);
  readonly tasks = this.taskService.tasks;

  viewMode: 'month' | 'week' = 'month';
  readonly currentDate = signal(new Date());
  readonly now = Date.now()
  readonly calendarDays = computed(() => {
    const date = this.currentDate();
    const year = date.getFullYear();
    const month = date.getMonth();

    const firstDay = new Date(year, month, 1);

    const startDay = new Date(firstDay);
    startDay.setDate(startDay.getDate() - startDay.getDay()); // przesunięcie do niedzieli poprzedniego tygodnia

    const days: Date[] = [];
    for (let i = 0; i < 42; i++) { // 6 tygodni
      const day = new Date(startDay);
      day.setDate(startDay.getDate() + i);
      days.push(day);
    }
    return days;
  });

  // Pobieranie zadań dla danego dnia
  getTasksForDay(day: Date) {
    return this.tasks().filter(task => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return taskDate.toDateString() === day.toDateString();
    });
  }

  previousMonth() {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() - 1);
    this.currentDate.set(newDate);
  }

  nextMonth() {
    const newDate = new Date(this.currentDate());
    newDate.setMonth(newDate.getMonth() + 1);
    this.currentDate.set(newDate);
  }

  today() {
    this.currentDate.set(new Date());
  }

  getPriorityColor(priority: string): string {
    const colors: Record<string, string> = {
      low: '#2e7d32',
      medium: '#ed6c02',
      high: '#d32f2f',
      critical: '#b71c1c'
    };
    return colors[priority] || '#757575';
  }

  onAdd() {
    console.log('Dodaj nowe zadanie z kalendarza');
  }
}