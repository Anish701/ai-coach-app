import React, { useRef, useEffect, useState } from "react";
import { Typography, Box, Paper, TextField, Button, IconButton, Modal } from "@mui/material";
import WebcamBox from "../../components/Webcam";
import detectPose from "../../utils/PoseDetector";
import { checkDeadBug, setDeadBugCount } from "../../utils/DeadBug";
import SettingsIcon from "@mui/icons-material/Settings";

/**
 * A React functional component that provides real-time tracking and feedback of the dead bug exercise, using
 * the Mediapipe Pose model and a webcam feed. The component displays the user's current underarm and hip angles,
 * repetition count, and feedback on the exercise form. It also allows the user to adjust the target 'flat' angle,
 * the angle the user must flatten their body towards for a legitimate repetition.
 *
 * @component
 *
 * @returns {JSX.Element} The JSX code to render the Dead Bug tracking page, including webcam feed, feedback,
 *                        repetition count, target angle display, and a reset button.
 */
function DeadBugPage() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const [targetFlatAngle, setTargetFlatAngle] = useState(140);

    const [leftUnderarmAngle, setLeftUnderarmAngle] = useState(0);
    const [rightUnderarmAngle, setRightUnderarmAngle] = useState(0);
    const [leftHipAngle, setLeftHipAngle] = useState(0);
    const [rightHipAngle, setRightHipAngle] = useState(0);

    const [feedback, setFeedback] = useState("");
    const [repCount, setRepCount] = useState(0);

    const [openModal, setOpenModal] = useState(false);

    const handleTargetFlatAngleChange = (event) => {
        setTargetFlatAngle(event.target.value);
    };

    const processPoseResults = (landmarks) => {
        checkDeadBug(
            landmarks,
            targetFlatAngle,
            setLeftUnderarmAngle,
            setRightUnderarmAngle,
            setLeftHipAngle,
            setRightHipAngle,
            setFeedback,
            setRepCount
        );
    };

    const handleReset = () => {
        setRepCount(0);
        setDeadBugCount(0);
    };

    /**
     * Opens the settings modal and stops the webcam stream to prevent
     * unnecessary resource usage while the user is adjusting settings.
     */
    const handleOpenModal = () => {
        setOpenModal(true);
        if (webcamRef.current && webcamRef.current.video) {
            const stream = webcamRef.current.video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        }
    };

    /**
     * Closes the settings modal and restarts the webcam stream and pose
     * detection when the user exits the modal.
     */
    const handleCloseModal = () => {
        setOpenModal(false);
        detectPose(webcamRef, canvasRef, processPoseResults);
    };

    useEffect(() => {
        detectPose(webcamRef, canvasRef, processPoseResults);
    }, []);

    return (
        <Box sx={{ display: "flex", justifyContent: "center", padding: "20px" }}>
            <Box sx={{ marginRight: "20px" }}>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{ marginBottom: "20px", textAlign: "center" }}>
                    Dead Bug
                </Typography>
                <WebcamBox ref={webcamRef} />
                <canvas
                    ref={canvasRef}
                    width="640"
                    height="480"
                    style={{ border: "2px solid black" }}
                />
            </Box>

            <Paper
                elevation={3}
                sx={{ padding: "20px", width: "300px", textAlign: "left", position: "relative" }}>
                <IconButton
                    sx={{ position: "absolute", top: "10px", right: "10px" }}
                    onClick={handleOpenModal}>
                    <SettingsIcon />
                </IconButton>
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    Real-Time Feedback Panel
                </Typography>
                <Typography variant="h6" sx={{ marginBottom: "20px" }}>
                    {"Feedback: "}
                    <span style={{ color: "red" }}>
                        {feedback ? feedback : "Please Begin Rep!"}
                    </span>
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Left Underarm Angle: {leftUnderarmAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Right Underarm Angle: {rightUnderarmAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Left Hip Angle: {leftHipAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Right Hip Angle: {rightHipAngle.toFixed(0)}°
                </Typography>
                <Typography variant="h6" gutterBottom sx={{ marginTop: "20px" }}>
                    Current Rep Count: {repCount}
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleReset}
                    sx={{ marginTop: "20px" }}>
                    Reset Rep Count
                </Button>
            </Paper>

            <Modal open={openModal} onClose={handleCloseModal}>
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 400,
                        bgcolor: "background.paper",
                        border: "2px solid black",
                        boxShadow: 24,
                        p: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                    }}>
                    <Typography
                        id="modal-modal-title"
                        variant="h6"
                        component="h2"
                        sx={{ marginBottom: "20px" }}>
                        Adjust Target Flat Angle
                    </Typography>
                    <TextField
                        id="outlined-number"
                        label="Target Flat Angle °"
                        type="number"
                        value={targetFlatAngle}
                        onChange={handleTargetFlatAngleChange}
                        sx={{ marginBottom: "20px" }}
                    />
                    <Button variant="contained" onClick={handleCloseModal}>
                        Save & Close
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

export default DeadBugPage;
