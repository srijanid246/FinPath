import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function useRequireProfile(error) {
  const navigate = useNavigate();

  useEffect(() => {
    if (error && (
      error.includes("Profile not found") ||
      error.includes("No strategy found") ||
      error.includes("No profile found")
    )) {
      navigate("/financial");
    }
  }, [error, navigate]);
}