import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import sourceResume from "./data/resume.json";

vi.mock("jspdf", () => {
  class MockJsPDF {
    constructor() {
      this.internal = {
        pageSize: {
          getWidth: () => 595,
          getHeight: () => 842,
        },
      };
    }

    setFont() {}
    setFontSize() {}
    splitTextToSize(text) {
      return [String(text)];
    }
    text() {}
    addPage() {}
    setLineWidth() {}
    line() {}
    save() {}
  }

  return { jsPDF: MockJsPDF };
});

describe("App interactive editor", () => {
  test("renders default resume data", () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: sourceResume.basics.full_name })).toBeInTheDocument();
    expect(screen.getByText("Interactive JSON Editor")).toBeInTheDocument();
  });

  test("applies valid JSON changes to preview", () => {
    render(<App />);

    const textarea = screen.getByLabelText("Resume JSON");
    const updated = {
      ...sourceResume,
      basics: {
        ...sourceResume.basics,
        full_name: "Avery Stone",
      },
    };

    fireEvent.change(textarea, { target: { value: JSON.stringify(updated, null, 2) } });
    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));

    expect(screen.getByRole("heading", { level: 1, name: "Avery Stone" })).toBeInTheDocument();
    expect(screen.getByText("Changes applied successfully.")).toBeInTheDocument();
  });

  test("shows error for invalid JSON and keeps previous data", () => {
    render(<App />);

    const textarea = screen.getByLabelText("Resume JSON");
    fireEvent.change(textarea, { target: { value: "{ invalid json" } });
    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));

    expect(screen.getByText(/Error:/)).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: sourceResume.basics.full_name })).toBeInTheDocument();
  });

  test("resets modified data back to defaults", () => {
    render(<App />);

    const textarea = screen.getByLabelText("Resume JSON");
    const updated = {
      ...sourceResume,
      basics: {
        ...sourceResume.basics,
        full_name: "Taylor Quinn",
      },
    };

    fireEvent.change(textarea, { target: { value: JSON.stringify(updated, null, 2) } });
    fireEvent.click(screen.getByRole("button", { name: "Apply Changes" }));
    expect(screen.getByRole("heading", { level: 1, name: "Taylor Quinn" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Reset" }));
    expect(screen.getByRole("heading", { level: 1, name: sourceResume.basics.full_name })).toBeInTheDocument();
    expect(screen.getByText("Reset to default resume.json content.")).toBeInTheDocument();
  });
});
