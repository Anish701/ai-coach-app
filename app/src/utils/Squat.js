import { calculateAngle } from './Angles';

let squatCount = 0;
let inSquatPosition = false;

/**
 * Monitors and tracks squat repetitions by analyzing the knee angle from pose landmarks.
 * Provides real-time feedback based on the depth of the squat.
 *
 * @param {Array} landmarks An array of pose landmarks containing the coordinates of different body points.
 * @param {Function} onFeedbackUpdate A callback function that receives the feedback message about the squat depth and form.
 * @param {Function} setLeftKneeAngle A function to update the current knee angle for display purposes.
 * @param {Function} setRepCount A function to update the squat count after a full squat is completed.
 */
export const checkSquats = (landmarks, onFeedbackUpdate, setCurrKneeAngle, setRepCount, targetKneeAngle = 70) => {
    const thresholdAngle = 160;

    const leftHip = landmarks[23];
    const leftKnee = landmarks[25];
    const leftAnkle = landmarks[27];

    const rightHip = landmarks[24];
    const rightKnee = landmarks[26];
    const rightAnkle = landmarks[28];

    const leftKneeAngle = calculateAngle(leftHip, leftKnee, leftAnkle);
    const rightKneeAngle = calculateAngle(rightHip, rightKnee, rightAnkle);

    setCurrKneeAngle(leftKneeAngle);

    let feedback = "Please Begin Rep!";

    if ((
        ((leftKneeAngle < thresholdAngle && leftKneeAngle > targetKneeAngle) ||
            (rightKneeAngle < thresholdAngle && rightKneeAngle > targetKneeAngle)) &&
        !inSquatPosition)) {
        feedback = "Go Down Lower!";
    } else if (leftKneeAngle < targetKneeAngle || rightKneeAngle < targetKneeAngle) {
        feedback = "Excellent!"
        inSquatPosition = true;
    } else if (leftKneeAngle > thresholdAngle || rightKneeAngle > thresholdAngle) {
        if (inSquatPosition) {
            feedback = "Excellent!"
            squatCount++;
            inSquatPosition = false;
            setRepCount(squatCount);
        }
    } else {
        if (inSquatPosition) {
            feedback = "Excellent!"
        }
    }

    onFeedbackUpdate(feedback);
};

/**
 * Resets squat count to specified value and resets squat position state.
 *
 * @param {number} val - The value to set the squat count to.
 */
export const setSquatCount = (val) => {
    squatCount = val;
    inSquatPosition = false;
};