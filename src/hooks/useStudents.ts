/**
 * Custom Hook for Student Operations
 * Author: Parth Rai
 */

import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Student } from '../types';
import { addStudent, updateStudent as updateStudentAction, deleteStudent as deleteStudentAction } from '../store/studentsSlice';

export const useStudents = () => {
  const dispatch = useDispatch();

  const fetchStudents = useCallback(async () => {
    // Mock API call
    return Promise.resolve([]);
  }, []);

  const createStudent = useCallback(async (student: Omit<Student, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newStudent: Student = {
      ...student,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    dispatch(addStudent(newStudent));
    return newStudent;
  }, [dispatch]);

  const updateStudent = useCallback(async (student: Student) => {
    const updatedStudent = {
      ...student,
      updatedAt: new Date(),
    };
    dispatch(updateStudentAction(updatedStudent));
    return updatedStudent;
  }, [dispatch]);

  const deleteStudent = useCallback(async (id: string) => {
    dispatch(deleteStudentAction(id));
  }, [dispatch]);

  const bulkDelete = useCallback(async (ids: string[]) => {
    ids.forEach(id => dispatch(deleteStudentAction(id)));
  }, [dispatch]);

  const exportStudents = useCallback(async (format: string, fields: string[], filters?: any) => {
    // Mock export functionality
    console.log('Exporting students:', { format, fields, filters });
    return Promise.resolve();
  }, []);

  const importStudents = useCallback(async (file: File) => {
    // Mock import functionality
    console.log('Importing students from file:', file.name);
    return Promise.resolve({ imported: 10, failed: 0, errors: [] });
  }, []);

  return {
    fetchStudents,
    createStudent,
    updateStudent,
    deleteStudent,
    bulkDelete,
    exportStudents,
    importStudents,
  };
};