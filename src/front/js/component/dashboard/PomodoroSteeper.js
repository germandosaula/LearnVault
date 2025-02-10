import React from "react";
import { Stepper, Step, StepLabel, useTheme } from "@mui/material";
import { MotionStepIcon } from "./CustomStepIcon";
import { styled } from "@mui/system";

const StyledStepLabel = styled(StepLabel)(({ theme, isActive }) => ({
    '& .MuiStepLabel-label': {
        fontFamily: 'Poppins, sans-serif',
        color: isActive ? '#ff2259' : 'white',
        ...(isActive && {
            fontWeight: '900',
            color: '#ff2259',
        }),
    },
    '& .MuiStepLabel-iconContainer': {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        transition: 'transform 0.2s ease',
        ...(isActive && {
            animation: 'pulse 1.5s infinite',
            transform: 'scale(1.2)',
        }),
    },
    '@keyframes pulse': {
        '0%': {
            transform: 'scale(1)',
        },
        '50%': {
            transform: 'scale(1.2)',
        },
        '100%': {
            transform: 'scale(1)',
        },
    },
}));

export const PomodoroStepper = ({ activeStep, steps, stepIcons }) => {
    return (
        <Stepper activeStep={activeStep} alternativeLabel>
            {steps.map((label, index) => (
                <Step key={label}>
                    <StyledStepLabel isActive={activeStep === index} StepIconComponent={() => stepIcons[index]}>
                        {label}
                    </StyledStepLabel>
                </Step>
            ))}
        </Stepper>
    );
};
