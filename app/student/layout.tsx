import React from "react";
import StudentContext from "./StudentContext";
import ViewMedia from "./ViewMedia";

function layout({ children }: { children: React.ReactNode }) {
  return (
    <StudentContext>
      {children}
      <ViewMedia />
    </StudentContext>
  );
}

export default layout;
