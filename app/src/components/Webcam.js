import React, { forwardRef } from 'react';
import Webcam from 'react-webcam';

const WebcamBox = forwardRef((props, ref) => {
    return (
        <div style={{ display: 'none' }}>
            <Webcam
                ref={ref}
                className="hidden-webcam"
                videoConstraints={{
                    width: 640,
                    height: 480,
                    facingMode: "user",
                }}
            />
        </div>
    );
});

export default WebcamBox;
