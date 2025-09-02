import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Stack,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Autocomplete,
} from "@mui/material";
import { Add, Edit, Delete, Close } from "@mui/icons-material";
import { useAuth } from "../contexts/AuthContext";
import { gradeAPI, enrollmentAPI } from "../services/api";
import type { Grade, Enrollment } from "../types";

const assessmentTypes = ["EXAM", "ASSIGNMENT", "QUIZ", "PROJECT", "PRACTICAL"];

const GradeManagement: React.FC = () => {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [form, setForm] = useState<Partial<Grade & { enrollmentId?: number }>>({
    enrollment: undefined,
    assessmentType: "EXAM",
    assessmentName: "",
    pointsEarned: 0,
    totalPoints: 100,
    letterGrade: "",
    weight: 1,
    assessmentDate: undefined,
    feedback: "",
    gradedBy: "",
  });
  const [alert, setAlert] = useState<{
    show: boolean;
    message: string;
    severity: "success" | "error" | "info";
  }>({ show: false, message: "", severity: "success" });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [gradesData, enrollmentsData] = await Promise.all([
        gradeAPI.getAllGrades(),
        enrollmentAPI.getAllEnrollments(),
      ]);
      setGrades(gradesData);
      setEnrollments(enrollmentsData);
    } catch (err) {
      console.error("Failed to load grades/enrollments", err);
      showAlert("Failed to load grade data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showAlert = (
    message: string,
    severity: "success" | "error" | "info"
  ) => {
    setAlert({ show: true, message, severity });
    setTimeout(
      () => setAlert({ show: false, message: "", severity: "success" }),
      5000
    );
  };

  const openCreateDialog = () => {
    setEditingGrade(null);
    setForm({
      assessmentType: "EXAM",
      assessmentName: "",
      pointsEarned: 0,
      totalPoints: 100,
      letterGrade: "",
      weight: 1,
      assessmentDate: undefined,
      feedback: "",
      gradedBy: "",
    });
    setDialogOpen(true);
  };

  const openEditDialog = (grade: Grade) => {
    setEditingGrade(grade);
    setForm({
      ...grade,
      enrollmentId: grade.enrollment?.id,
    } as any);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    try {
      if (!form.enrollment && !form.enrollmentId) {
        showAlert("Please select an enrollment", "error");
        return;
      }

      const payload: any = {
        enrollmentId: form.enrollment?.id ?? form.enrollmentId,
        assessmentType: form.assessmentType,
        assessmentName: form.assessmentName,
        pointsEarned: Number(form.pointsEarned) || 0,
        totalPoints: Number(form.totalPoints) || 100,
        letterGrade: form.letterGrade,
        weight: Number(form.weight) || 1,
        assessmentDate: form.assessmentDate,
        feedback: form.feedback,
        gradedBy: form.gradedBy,
      };

      if (editingGrade) {
        await gradeAPI.updateGrade(editingGrade.id, payload);
        showAlert("Grade updated", "success");
      } else {
        await gradeAPI.createGrade(payload);
        showAlert("Grade created", "success");
      }
      setDialogOpen(false);
      loadData();
    } catch (err: any) {
      console.error("Save grade failed", err);
      showAlert(
        err?.response?.data?.message || "Failed to save grade",
        "error"
      );
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this grade?")) return;
    try {
      await gradeAPI.deleteGrade(id);
      showAlert("Grade deleted", "success");
      loadData();
    } catch (err) {
      console.error("Delete grade failed", err);
      showAlert("Failed to delete grade", "error");
    }
  };

  const calculateAvgForStudent = async (studentId: number) => {
    try {
      const avg = await gradeAPI.getAverageGradeByStudent(studentId);
      showAlert(`Average for student: ${avg.toFixed(2)}`, "info");
    } catch (err) {
      console.error("Failed to calc average", err);
      showAlert("Failed to get average", "error");
    }
  };

  const calculateAvgForCourse = async (courseId: number) => {
    try {
      const avg = await gradeAPI.getAverageGradeByCourse(courseId);
      showAlert(`Average for course: ${avg.toFixed(2)}`, "info");
    } catch (err) {
      console.error("Failed to calc average", err);
      showAlert("Failed to get average", "error");
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={240}
      >
        <CircularProgress />
      </Box>
    );

  const { isAdmin } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h5">Grade Management</Typography>
        {isAdmin() && (
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={openCreateDialog}
          >
            Create Grade
          </Button>
        )}
      </Stack>

      {alert.show && (
        <Alert severity={alert.severity} sx={{ mb: 2 }}>
          {alert.message}
        </Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Assessment</TableCell>
              <TableCell>Points</TableCell>
              <TableCell>Letter</TableCell>
              <TableCell>Weight</TableCell>
              <TableCell>Graded By</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {grades.map((g) => (
              <TableRow key={g.id}>
                <TableCell>{g.id}</TableCell>
                <TableCell>
                  {g.enrollment?.student?.studentId} -{" "}
                  {g.enrollment?.student?.firstName}{" "}
                  {g.enrollment?.student?.lastName}
                </TableCell>
                <TableCell>
                  {g.enrollment?.course?.code} - {g.enrollment?.course?.title}
                </TableCell>
                <TableCell>
                  {g.assessmentType} / {g.assessmentName}
                </TableCell>
                <TableCell>
                  {g.pointsEarned} / {g.totalPoints}
                </TableCell>
                <TableCell>{g.letterGrade || "-"}</TableCell>
                <TableCell>{g.weight ?? "-"}</TableCell>
                <TableCell>{g.gradedBy || "-"}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <IconButton size="small" onClick={() => openEditDialog(g)}>
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => handleDelete(g.id)}
                    >
                      <Delete fontSize="small" />
                    </IconButton>
                    <Button
                      size="small"
                      onClick={() =>
                        g.enrollment?.student?.id &&
                        calculateAvgForStudent(g.enrollment.student.id)
                      }
                    >
                      Avg (Student)
                    </Button>
                    <Button
                      size="small"
                      onClick={() =>
                        g.enrollment?.course?.id &&
                        calculateAvgForCourse(g.enrollment.course.id)
                      }
                    >
                      Avg (Course)
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            {editingGrade ? "Edit Grade" : "Create Grade"}
            <IconButton onClick={() => setDialogOpen(false)}>
              <Close />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Autocomplete
              options={enrollments}
              getOptionLabel={(opt) =>
                `${opt.id} - ${opt.student?.studentId || ""} - ${
                  opt.course?.code || ""
                }`
              }
              value={
                enrollments.find(
                  (e) => e.id === (form.enrollment?.id || form.enrollmentId)
                ) || null
              }
              onChange={(_, v) =>
                setForm({ ...form, enrollment: v as any, enrollmentId: v?.id })
              }
              renderInput={(params) => (
                <TextField {...params} label="Enrollment" />
              )}
            />

            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                value={form.assessmentType}
                label="Type"
                onChange={(e) =>
                  setForm({ ...form, assessmentType: e.target.value as string })
                }
              >
                {assessmentTypes.map((t) => (
                  <MenuItem value={t} key={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              label="Assessment Name"
              fullWidth
              value={form.assessmentName}
              onChange={(e) =>
                setForm({ ...form, assessmentName: e.target.value })
              }
            />

            <Stack direction="row" spacing={2}>
              <TextField
                label="Points Earned"
                type="number"
                value={form.pointsEarned ?? 0}
                onChange={(e) =>
                  setForm({ ...form, pointsEarned: Number(e.target.value) })
                }
              />
              <TextField
                label="Total Points"
                type="number"
                value={form.totalPoints ?? 100}
                onChange={(e) =>
                  setForm({ ...form, totalPoints: Number(e.target.value) })
                }
              />
              <TextField
                label="Letter Grade"
                value={form.letterGrade}
                onChange={(e) =>
                  setForm({ ...form, letterGrade: e.target.value })
                }
              />
            </Stack>

            <Stack direction="row" spacing={2}>
              <TextField
                label="Weight"
                type="number"
                value={form.weight ?? 1}
                onChange={(e) =>
                  setForm({ ...form, weight: Number(e.target.value) })
                }
              />
              <TextField
                label="Assessment Date (ISO)"
                value={form.assessmentDate ?? ""}
                onChange={(e) =>
                  setForm({ ...form, assessmentDate: e.target.value })
                }
                placeholder="2025-10-15T10:00:00"
              />
            </Stack>

            <TextField
              label="Feedback"
              multiline
              rows={3}
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            />
            <TextField
              label="Graded By"
              value={form.gradedBy}
              onChange={(e) => setForm({ ...form, gradedBy: e.target.value })}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!form.enrollment && !form.enrollmentId}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GradeManagement;
