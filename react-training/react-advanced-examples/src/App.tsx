import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './components/ThemeProvider'
import { AuthProvider } from './auth/AuthProvider'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'
import { lazy, Suspense } from 'react'
import ErrorBoundary from './components/ErrorBoundary'
import Loading from './components/Loading'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import TodoQueryPagination from './components/TodoQueryPagination'
import TodoLoadMore from './components/TodoLoadMore'
import TodoMutations from './components/TodoMutations'
import TodoUpdate from './components/TodoUpdate'

const Login = lazy(() => import('./pages/Login'))
const Books = lazy(() => import('./pages/Book'))
const UserForm = lazy(() => import('./pages/Book'))
const CreateBook = lazy(() => import('./components/UserForm'))
const People = lazy(() => import('./components/People'))
const Student = lazy(() => import('./components/Student'))
const NotFound = lazy(() => import('./components/NotFound'))
const SignUp = lazy(() => import('./pages/SignUp'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const TaskDetail = lazy(() => import('./pages/TaskDetail'))
const MyTask = lazy(() => import('./pages/MyTask'))
const DashboardHome = lazy(() => import('./components/DashboardHome'))
const VitalTask = lazy(() => import('./pages/VitalTask'))
const TaskCategories = lazy(() => import('./pages/TaskCategories'))
const Settings = lazy(() => import('./pages/Settings'))
const Help = lazy(() => import('./pages/Help'))
const TodoQuery = lazy(() => import('./components/TodoQuery'))
const TodoQueryDetail = lazy(() => import('./components/TodoQueryDetail'))

function App() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5000,
        refetchOnWindowFocus: false,
        retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  })

  return (
    <QueryClientProvider client={queryClient}>
      <TodoQuery />
      {/* <TodoQueryPagination /> */}
      {/* <TodoLoadMore /> */}
      <TodoQueryDetail todoId={24} />
      <TodoMutations />
      <TodoUpdate />
    </QueryClientProvider>
    // <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    //   <ErrorBoundary>
    //     <AuthProvider>
    //       <BrowserRouter>
    //         <Suspense fallback={<Loading />}>
    //           <Routes>
    //             <Route index path="/" element={<Navigate to="/dashboard" replace />} />
    //             <Route path="dashboard" element={
    //               <ProtectedRoute>
    //                 <Dashboard />
    //               </ProtectedRoute>
    //             }>
    //               <Route index element={<DashboardHome />} />
    //               <Route path="tasks/:taskId" element={
    //                   <TaskDetail />
    //               } />
    //               <Route path="tasks" element={<MyTask />} />
    //               <Route path="vital-tasks" element={<VitalTask />} />
    //               <Route path="task-categories" element={<TaskCategories />} />
    //               <Route path="settings" element={<Settings />} />
    //               <Route path="help" element={<Help />} />
    //             </Route>
    //             <Route path="login" element={<Login />} />
    //             <Route path="books" element={
    //               <ProtectedRoute>
    //                 <Books />
    //               </ProtectedRoute>
    //             } />
    //             <Route path="books/create" element={
    //               <ProtectedRoute>
    //                 <CreateBook />
    //               </ProtectedRoute>
    //             } />
    //             <Route path="user" element={<UserForm />} />
    //             <Route path="people" element={<People />} />
    //             <Route path="student" element={<Student />} />
    //             <Route path="sign-up" element={<SignUp />} />
    //             <Route path="*" element={<NotFound />} />
    //           </Routes>
    //         </Suspense>
    //       </BrowserRouter>
    //     </AuthProvider>
    //   </ErrorBoundary>
    // </ThemeProvider>
  )
}

export default App
