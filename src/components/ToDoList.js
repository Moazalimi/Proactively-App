import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getItem, setItem } from '../services/storageService';
import { getCurrentUser } from '../services/authService';
import { formatDateToMMM_D_YYYY } from '../utils/formatDate'; // Import the new formatter

export default function ToDoList({ appointment }) {
  const [tasks, setTasks] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const fetchTasksForUser = async () => {
      try {
        const user = await getCurrentUser();
        if (!user) {
          console.error('No user is logged in');
          return;
        }
        setCurrentUser(user);

        const storedTasks = await getItem(`tasks_${user.username}`);
        if (storedTasks?.length) {
          setTasks(
            storedTasks.map(task =>
              task.id === '4' && appointment?.doctorName
                ? { ...task, title: `Complete 2 courses of ${appointment.doctorName}` }
                : task
            )
          );
        } else {
          const defaultTasks = [
            { id: '1', title: 'Achieve 30k steps every week for blood sugar', done: false },
            { id: '2', title: 'Take up health coaching', done: false },
            { id: '3', title: 'Go to a nearby gym and workout for 30 mins', done: false },
            {
              id: '4',
              title: `Complete 2 courses of ${appointment?.doctorName || 'your doctor'}`,
              done: false,
            },
          ];
          await setItem(`tasks_${user.username}`, defaultTasks);
          setTasks(defaultTasks);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
        Alert.alert('Error', 'Failed to load tasks. Please try again.');
      }
    };

    fetchTasksForUser();
  }, [appointment]);

  const toggleTask = async (id) => {
    try {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      );
      setTasks(updatedTasks);
      if (currentUser) {
        await setItem(`tasks_${currentUser.username}`, updatedTasks);
      }
    } catch (error) {
      console.error('Error updating tasks:', error);
      Alert.alert('Error', 'Failed to update task. Please try again.');
    }
  };

  if (!currentUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Please log in to view your tasks.</Text>
      </View>
    );
  }

  if (!appointment) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Set an appointment to start off your to-dos.</Text>
      </View>
    );
  }

  const completedCount = tasks.filter((task) => task.done).length;
  const progress = tasks.length > 0 ? completedCount / tasks.length : 0;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Let’s check off your to-dos</Text>
      <Text style={styles.progressText}>{`${completedCount}/${tasks.length} Completed`}</Text>
      <View style={styles.progressBarContainer}>
        <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
      </View>
      <View style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task.id} style={[styles.taskCard, task.done && styles.taskCardCompleted]}>
            <TouchableOpacity
              onPress={() => toggleTask(task.id)}
              style={[styles.checkbox, task.done && styles.checkboxChecked]}
            >
              <Icon
                name={task.done ? 'check-box' : 'check-box-outline-blank'}
                size={30}
                color={task.done ? '#49A275' : '#CCC'}
              />
            </TouchableOpacity>
            <View style={styles.taskContent}>
              <Text style={[styles.taskTitle, task.done && styles.taskDone]}>{task.title}</Text>
              <Text style={styles.taskDate}>
                  {appointment?.doctorName || 'Doctor'} •{' '}
                  {appointment?.date ? formatDateToMMM_D_YYYY(appointment.date) : 'N/A'}
              </Text>

            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
  },
  header: {
    fontSize: 18,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#555',
    marginBottom: 20,
  },
  progressText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 15,
    backgroundColor: '#F1F8F4',
    borderRadius: 7.5,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#77C69F',
    borderRadius: 7.5,
  },
  taskList: {
    marginTop: 16,
  },
  taskCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 16,
    borderWidth: 1,
    borderColor: '#DDD',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  taskCardCompleted: {
    borderColor: '#CCE5CC',
  },
  checkbox: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    cornerRadius: 150,
  },
  checkboxChecked: {},
  taskContent: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
    color: '#000',
  },
  taskDone: {
    textDecorationLine: 'line-through',
    color: '#888',
  },
  taskDate: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  message: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
});
