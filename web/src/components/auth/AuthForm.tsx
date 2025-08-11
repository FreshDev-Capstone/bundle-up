import React from "react";
import { AuthFormProps } from "../../../shared/types";
import { useAuthForm } from "../../../shared/hooks";
import "./AuthForm.css";

export default function AuthForm({
  mode,
  onSubmit,
  initialValues = {},
  loading,
  error,
}: AuthFormProps) {
  const { values, handleChange, handleSubmit, validationErrors } = useAuthForm({
    mode,
    onSubmit,
    initialValues,
    loading,
    error,
  });

  return (
    <div className="auth-form">
      {mode === "signup" && (
        <>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="First Name"
              value={values.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
            />
            {validationErrors.firstName && (
              <span className="error-message">
                {validationErrors.firstName}
              </span>
            )}
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Last Name"
              value={values.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
            />
            {validationErrors.lastName && (
              <span className="error-message">{validationErrors.lastName}</span>
            )}
          </div>
        </>
      )}

      <div className="form-group">
        <input
          type="email"
          className="form-input"
          placeholder="Email"
          value={values.email}
          onChange={(e) => handleChange("email", e.target.value)}
          autoComplete="email"
        />
        {validationErrors.email && (
          <span className="error-message">{validationErrors.email}</span>
        )}
      </div>

      <div className="form-group">
        <input
          type="password"
          className="form-input"
          placeholder="Password"
          value={values.password}
          onChange={(e) => handleChange("password", e.target.value)}
          autoComplete="current-password"
        />
        {validationErrors.password && (
          <span className="error-message">{validationErrors.password}</span>
        )}
      </div>

      {mode === "signup" && (
        <div className="form-group">
          <input
            type="password"
            className="form-input"
            placeholder="Confirm Password"
            value={values.confirmPassword}
            onChange={(e) => handleChange("confirmPassword", e.target.value)}
            autoComplete="new-password"
          />
          {validationErrors.confirmPassword && (
            <span className="error-message">
              {validationErrors.confirmPassword}
            </span>
          )}
        </div>
      )}

      {error && <div className="error-message">{error}</div>}

      <button
        type="button"
        className="submit-button"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Loading..." : mode === "login" ? "Login" : "Sign Up"}
      </button>
    </div>
  );
}
