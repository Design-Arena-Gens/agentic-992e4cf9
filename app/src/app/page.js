"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import clsx from "clsx";

const steps = [
  {
    id: "info",
    title: "Your Info",
    subtitle: "Tell us who you are so we can personalize your workspace."
  },
  {
    id: "patients",
    title: "Add Patients",
    subtitle:
      "Capture critical patient details with a responsive, dynamic form."
  },
  {
    id: "complete",
    title: "Complete",
    subtitle: "Review everything at a glance before completing setup."
  }
];

const genders = ["Female", "Male", "Non-binary", "Prefer not to say"];

export default function Page() {
  const [cursor, setCursor] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(1);
  const [info, setInfo] = useState({
    name: "",
    role: "",
    organization: ""
  });
  const [patientForm, setPatientForm] = useState({
    name: "",
    age: "",
    gender: genders[0],
    bloodType: "",
    allergies: "",
    medicalConditions: "",
    emergencyContact: "",
    emergencyPhone: ""
  });
  const [patients, setPatients] = useState([]);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    const handlePointerMove = (event) => {
      setCursor({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  const focusStep = useMemo(() => steps[step - 1], [step]);

  const goNext = useCallback(() => {
    setStep((prev) => Math.min(prev + 1, steps.length));
  }, []);

  const goBack = useCallback(() => {
    setStep((prev) => Math.max(prev - 1, 1));
  }, []);

  const handleInfoChange = useCallback((field, value) => {
    setInfo((prev) => ({ ...prev, [field]: value }));
  }, []);

  const handlePatientChange = useCallback((field, value) => {
    setPatientForm((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetPatientForm = useCallback(() => {
    setPatientForm((prev) => ({
      ...prev,
      name: "",
      age: "",
      bloodType: "",
      allergies: "",
      medicalConditions: "",
      emergencyContact: "",
      emergencyPhone: ""
    }));
  }, []);

  const addPatient = useCallback(() => {
    if (!patientForm.name.trim() || !patientForm.age.trim()) {
      setFormError("Patient name and age are required.");
      return;
    }

    setPatients((prev) => [
      ...prev,
      {
        id: crypto.randomUUID(),
        ...patientForm
      }
    ]);
    setFormError("");
    resetPatientForm();
  }, [patientForm, resetPatientForm]);

  const removePatient = useCallback((id) => {
    setPatients((prev) => prev.filter((patient) => patient.id !== id));
  }, []);

  return (
    <main className="page-root">
      <div
        className="cursor-ripple"
        style={{
          background: `radial-gradient(400px at ${cursor.x}px ${cursor.y}px, rgba(56,189,248,0.22), transparent 65%)`
        }}
      />

      <div className="shell">
        <aside className="steps">
          <div className="steps__header">
            <div className="logo-dot" />
            <h1>Clinic Setup</h1>
            <p>Finish onboarding in three quick steps.</p>
          </div>

          <ul className="steps__list">
            {steps.map((item, index) => {
              const position = index + 1;
              const isActive = position === step;
              const isComplete = position < step;
              return (
                <li key={item.id}>
                  <button
                    className={clsx("step-chip", {
                      "step-chip--active": isActive,
                      "step-chip--complete": isComplete
                    })}
                    type="button"
                    onClick={() => setStep(position)}
                  >
                    <span className="step-chip__index">{`0${position}`}</span>
                    <span>
                      <span className="step-chip__title">{item.title}</span>
                      <span className="step-chip__subtitle">
                        {item.subtitle}
                      </span>
                    </span>
                    {isComplete && (
                      <motion.span
                        className="step-chip__status"
                        layoutId="step-complete"
                      >
                        ✓
                      </motion.span>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>

        <section className="content">
          <header className="content__header">
            <div>
              <div className="content__step">{`Step ${step} of ${steps.length}`}</div>
              <h2>{focusStep.title}</h2>
              <p>{focusStep.subtitle}</p>
            </div>
            <motion.div
              className="progress"
              initial={{ width: 0 }}
              animate={{ width: `${(step / steps.length) * 100}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 24 }}
            />
          </header>

          <div className="content__body">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div
                  key="step-one"
                  className="panel"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="grid">
                    <Field
                      label="Full Name"
                      hint="How should we address you?"
                      value={info.name}
                      onChange={(event) =>
                        handleInfoChange("name", event.target.value)
                      }
                      placeholder="Dr. Jamie Carter"
                    />
                    <Field
                      label="Role"
                      hint="What best describes your role?"
                      value={info.role}
                      onChange={(event) =>
                        handleInfoChange("role", event.target.value)
                      }
                      placeholder="Lead Physician"
                    />
                    <Field
                      label="Organization"
                      hint="The facility or practice you represent."
                      value={info.organization}
                      onChange={(event) =>
                        handleInfoChange("organization", event.target.value)
                      }
                      placeholder="Crescent Health"
                    />
                  </div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div
                  key="step-two"
                  className="panel"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <div className="grid grid--two">
                    <Field
                      label="Patient Name *"
                      value={patientForm.name}
                      onChange={(event) =>
                        handlePatientChange("name", event.target.value)
                      }
                      placeholder="Full name"
                      required
                    />
                    <Field
                      label="Age *"
                      value={patientForm.age}
                      onChange={(event) =>
                        handlePatientChange("age", event.target.value)
                      }
                      placeholder="Age"
                      inputMode="numeric"
                      required
                    />
                    <SelectField
                      label="Gender"
                      value={patientForm.gender}
                      onChange={(event) =>
                        handlePatientChange("gender", event.target.value)
                      }
                      options={genders}
                    />
                    <Field
                      label="Blood Type"
                      value={patientForm.bloodType}
                      onChange={(event) =>
                        handlePatientChange("bloodType", event.target.value)
                      }
                      placeholder="e.g., O+"
                    />
                    <Field
                      label="Allergies"
                      value={patientForm.allergies}
                      onChange={(event) =>
                        handlePatientChange("allergies", event.target.value)
                      }
                      placeholder="Any allergies"
                    />
                    <Field
                      label="Medical Conditions"
                      value={patientForm.medicalConditions}
                      onChange={(event) =>
                        handlePatientChange(
                          "medicalConditions",
                          event.target.value
                        )
                      }
                      placeholder="List any medical conditions"
                    />
                    <Field
                      label="Emergency Contact"
                      value={patientForm.emergencyContact}
                      onChange={(event) =>
                        handlePatientChange(
                          "emergencyContact",
                          event.target.value
                        )
                      }
                      placeholder="Contact name"
                    />
                    <Field
                      label="Emergency Phone"
                      value={patientForm.emergencyPhone}
                      onChange={(event) =>
                        handlePatientChange(
                          "emergencyPhone",
                          event.target.value
                        )
                      }
                      placeholder="Contact phone"
                      inputMode="tel"
                    />
                  </div>

                  <div className="panel__actions">
                    {formError && <p className="error">{formError}</p>}
                    <motion.button
                      type="button"
                      className="primary"
                      onClick={addPatient}
                      whileTap={{ scale: 0.96 }}
                      whileHover={{ scale: 1.02 }}
                    >
                      Add Patient
                    </motion.button>
                  </div>

                  <AnimatePresence initial={false}>
                    {patients.length > 0 && (
                      <motion.div
                        className="patients"
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -12 }}
                      >
                        {patients.map((patient) => (
                          <motion.article
                            key={patient.id}
                            className="patient-card"
                            layout
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                          >
                            <div>
                              <h3>{patient.name}</h3>
                              <p>
                                {patient.age} · {patient.gender} ·{" "}
                                {patient.bloodType || "Blood type N/A"}
                              </p>
                              <dl>
                                <div>
                                  <dt>Allergies</dt>
                                  <dd>
                                    {patient.allergies || "No allergies noted"}
                                  </dd>
                                </div>
                                <div>
                                  <dt>Medical Conditions</dt>
                                  <dd>
                                    {patient.medicalConditions ||
                                      "None reported"}
                                  </dd>
                                </div>
                                <div>
                                  <dt>Emergency Contact</dt>
                                  <dd>
                                    {patient.emergencyContact
                                      ? `${patient.emergencyContact} · ${patient.emergencyPhone}`
                                      : "No emergency contact set"}
                                  </dd>
                                </div>
                              </dl>
                            </div>
                            <button
                              className="ghost"
                              type="button"
                              onClick={() => removePatient(patient.id)}
                            >
                              Remove
                            </button>
                          </motion.article>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div
                  key="step-three"
                  className="panel panel--center"
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                >
                  <motion.div
                    className="celebration"
                    initial={{ rotate: -12, scale: 0.8 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ type: "spring", stiffness: 120, damping: 10 }}
                  >
                    🎉
                  </motion.div>
                  <h3>Setup Complete</h3>
                  <p>
                    Review your details and finalize your patient workspace.
                  </p>
                  <div className="summary">
                    <section>
                      <h4>Your Info</h4>
                      <ul>
                        <li>{info.name || "Name not provided"}</li>
                        <li>{info.role || "Role not provided"}</li>
                        <li>{info.organization || "Organization not provided"}</li>
                      </ul>
                    </section>
                    <section>
                      <h4>Patients ({patients.length})</h4>
                      <ul>
                        {patients.length > 0 ? (
                          patients.map((patient) => (
                            <li key={patient.id}>{patient.name}</li>
                          ))
                        ) : (
                          <li>No patients added yet.</li>
                        )}
                      </ul>
                    </section>
                  </div>
                  <motion.button
                    type="button"
                    className="primary"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Launch Workspace
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <footer className="content__footer">
            <button
              type="button"
              className="ghost ghost--muted"
              onClick={goBack}
              disabled={step === 1}
            >
              Back
            </button>
            <motion.button
              type="button"
              className="primary"
              onClick={goNext}
              disabled={step === steps.length}
              whileTap={{ scale: 0.96 }}
              whileHover={{ scale: step === steps.length ? 1 : 1.04 }}
            >
              {step === steps.length ? "Complete" : "Continue"}
            </motion.button>
          </footer>
        </section>
      </div>
    </main>
  );
}

function Field({
  label,
  hint,
  value,
  onChange,
  placeholder,
  required,
  inputMode
}) {
  return (
    <label className="field">
      <span className="field__label">
        {label}
        {required && <span className="field__required">*</span>}
      </span>
      {hint && <span className="field__hint">{hint}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
      />
      <span className="field__focus" />
    </label>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <div className="select">
        <select value={value} onChange={onChange}>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
        <span className="select__icon">⌄</span>
      </div>
      <span className="field__focus" />
    </label>
  );
}
