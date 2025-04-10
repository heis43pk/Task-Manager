import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DraggableFlatList } from 'react-native-draggable-flatlist';
import axios from 'axios';

const KanbanScreen = () => {
  const [columns, setColumns] = useState({
    todo: [],
    inprogress: [],
    done: []
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://your-api:5000/api/tasks/kanban');
      setColumns(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleTaskMove = async (taskId, newStatus, newPosition) => {
    try {
      await axios.patch(`http://your-api:5000/api/tasks/move/${taskId}`, {
        newStatus,
        newPosition
      });
      fetchTasks(); // Refresh after move
    } catch (error) {
      console.error('Error moving task:', error);
    }
  };

  const renderColumn = (columnKey, title, color) => (
    <View style={styles.column}>
      <Text style={[styles.columnTitle, { backgroundColor: color }]}>{title}</Text>
      <DraggableFlatList
        data={columns[columnKey]}
        keyExtractor={(item) => item.id.toString()}
        onDragEnd={({ data }) => handleDragEnd(columnKey, data)}
        renderItem={({ item, drag }) => (
          <TouchableOpacity
            style={styles.taskCard}
            onLongPress={drag}
          >
            <Text>{item.title}</Text>
            <Text style={styles.taskDescription}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      {renderColumn('todo', 'To Do', '#4CAF50')}
      {renderColumn('inprogress', 'In Progress', '#FFC107')}
      {renderColumn('done', 'Done', '#9E9E9E')}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    padding: 10,
  },
  column: {
    flex: 1,
    margin: 5,
  },
  columnTitle: {
    padding: 10,
    fontWeight: 'bold',
    textAlign: 'center',
    borderRadius: 5,
    color: 'white',
  },
  taskCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 5,
    margin: 5,
    elevation: 2,
  },
  taskDescription: {
    color: '#666',
    fontSize: 12,
    marginTop: 5,
  }
});