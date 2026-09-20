
import React, { useEffect, useMemo, useState } from "react";

const API_URL =
  "https://pathwheeler-backend.onrender.com/api";

// ============================================================
// API HELPER
// ============================================================

async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("pathwheelers_token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  let data = {};

  try {
    data = await response.json();
  } catch {
    data = {};
  }

  if (!response.ok) {
    throw new Error(
      data.message || "Something went wrong. Please try again."
    );
  }

  return data;
}


// ============================================================
// SMALL HELPERS
// ============================================================

function formatMoney(value) {
  const number = Number(value || 0);

  return new Intl.NumberFormat("en-KE", {
    style: "currency",
    currency: "KES",
    minimumFractionDigits: 2,
  }).format(number);
}


function formatDate(date) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleDateString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return date;
  }
}


function formatDateTime(date) {
  if (!date) return "—";

  try {
    return new Date(date).toLocaleString("en-KE", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return date;
  }
}


function initials(name) {
  if (!name) return "PW";

  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}


// ============================================================
// MAIN APP
// ============================================================

export default function App() {

  // ----------------------------------------------------------
  // AUTH
  // ----------------------------------------------------------

  const [token, setToken] = useState(
    () => localStorage.getItem("pathwheelers_token")
  );

  const [currentUser, setCurrentUser] = useState(null);

  const [authMode, setAuthMode] = useState("login");

  const [loginEmail, setLoginEmail] = useState("");

  const [loginPassword, setLoginPassword] = useState("");

  const [loginUsername, setLoginUsername] = useState("");

  const [loginType, setLoginType] = useState("admin");

  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [developmentCode, setDevelopmentCode] =
    useState("");

  const [authLoading, setAuthLoading] = useState(false);

  const [authError, setAuthError] = useState("");

  

  const [authMessage, setAuthMessage] = useState("");

  const [registerName, setRegisterName] = useState("");

  const [registerEmail, setRegisterEmail] = useState("");

  const [registerPassword, setRegisterPassword] =
    useState("");

    



  // ----------------------------------------------------------
  // NAVIGATION
  // ----------------------------------------------------------

  const [page, setPage] = useState("dashboard");

  const [selectedYear, setSelectedYear] = useState(null);

  const [selectedTerm, setSelectedTerm] = useState(null);

  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);


  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [years, setYears] = useState([]);

  const [employees, setEmployees] = useState([]);

  const [attendance, setAttendance] = useState([]);

  const [payments, setPayments] = useState([]);

  const [gasPayments, setGasPayments] = useState([]);

  const [employeeSummary, setEmployeeSummary] =
    useState(null);

  const [selectedEmployee, setSelectedEmployee] =
    useState(null);
  

  // ----------------------------------------------------------
  // LOADING / NOTICES
  // ----------------------------------------------------------

  const [loading, setLoading] = useState(false);

  const [notice, setNotice] = useState("");

  const [errorMessage, setErrorMessage] = useState("");


  // ----------------------------------------------------------
  // CREATE YEAR
  // ----------------------------------------------------------

  const [showYearModal, setShowYearModal] =
    useState(false);

  const [newYear, setNewYear] = useState(
    new Date().getFullYear()
  );


  // ----------------------------------------------------------
  // EMPLOYEE
  // ----------------------------------------------------------

  const [showEmployeeModal, setShowEmployeeModal] =
    useState(false);

  const [employeeForm, setEmployeeForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    profile_picture: "",
  });


  // ----------------------------------------------------------
  // ATTENDANCE
  // ----------------------------------------------------------

  const [attendanceDate, setAttendanceDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

    const [attendanceAmounts, setAttendanceAmounts] = useState({});

  const [attendanceDraft, setAttendanceDraft] =
    useState({});

  const [attendanceSearch, setAttendanceSearch] =
    useState("");

  const [attendanceNotes, setAttendanceNotes] =
    useState({});


  // ----------------------------------------------------------
  // PAYMENT
  // ----------------------------------------------------------

  const [paymentModal, setPaymentModal] =
    useState(false);

  const [paymentMethod, setPaymentMethod] =
    useState(null);

  const [paymentAmount, setPaymentAmount] =
    useState("");

  const [paymentMessage, setPaymentMessage] =
    useState("");

  const [paymentPreview, setPaymentPreview] =
    useState(null);

  const [paymentProcessing, setPaymentProcessing] =
    useState(false);


  // ----------------------------------------------------------
  // GAS
  // ----------------------------------------------------------

  const [gasAmount, setGasAmount] = useState("");

  const [gasLoading, setGasLoading] = useState(false);


  // ==========================================================
  // AUTH CHECK
  // ==========================================================

  useEffect(() => {

    if (!token) return;

    loadCurrentUser();

  }, [token]);


 async function loadCurrentUser() {

  try {

    const result = await apiRequest(
      "/auth/me"
    );

    setCurrentUser(
      result.user || result.data || null
    );

  } catch (error) {

    console.error(
      "AUTH CHECK ERROR:",
      error
    );

    localStorage.removeItem(
      "pathwheelers_token"
    );

    setToken(null);
    setCurrentUser(null);

  }
}

  // ==========================================================
  // LOAD YEARS
  // ==========================================================

  useEffect(() => {

    if (!token) return;

    loadYears();

  }, [token]);


  async function loadYears() {

    try {

      const result = await apiRequest("/years");

      setYears(result.data || []);

    } catch (error) {

      setErrorMessage(error.message);

    }
  }


  // ==========================================================
  // LOAD EMPLOYEES
  // ==========================================================

  useEffect(() => {

    if (!token) return;

    loadEmployees();

  }, [token]);


  async function loadEmployees() {

    try {

      const result = await apiRequest(
        "/employees"
      );

      setEmployees(result.data || []);

    } catch (error) {

      setErrorMessage(error.message);

    }
  }


  // ==========================================================
  // LOAD ATTENDANCE
  // ==========================================================

  useEffect(() => {

    if (!selectedTerm || !token) return;

    if (page !== "attendance") return;

    loadAttendance();

  }, [
    selectedTerm,
    page,
    token,
  ]);



async function loadAttendance() {

  try {

    setLoading(true);

    const result = await apiRequest(
      `/terms/${selectedTerm.id}/attendance`
    );

    const records = result.data || [];

    setAttendance(records);

    const draft = {};
    const amounts = {};
    const notes = {};

    records
      .filter(
        (record) =>
          record.attendance_date ===
          attendanceDate
      )
      .forEach((record) => {

        // -------------------------------
        // Attendance status
        // -------------------------------

        draft[record.employee_id] =
          record.status;


        // -------------------------------
        // Amount earned
        //
        // This comes directly from MySQL.
        // We DO NOT use daily_rate.
        // -------------------------------

        amounts[record.employee_id] =
          record.amount_earned ?? "";


        // -------------------------------
        // Notes
        // -------------------------------

        notes[record.employee_id] =
          record.notes || "";

      });


    setAttendanceDraft(
      draft
    );

    setAttendanceAmounts(
      amounts
    );

    setAttendanceNotes(
      notes
    );

  } catch (error) {

    setErrorMessage(
      error.message
    );

  } finally {

    setLoading(false);

  }

}


  // ==========================================================
  // LOAD GAS
  // ==========================================================

  useEffect(() => {

    if (!selectedTerm || !token) return;

    if (page !== "gas") return;

    loadGasPayments();

  }, [
    selectedTerm,
    page,
    token,
  ]);


 async function loadGasPayments() {
  try {
    setLoading(true);

    const result = await apiRequest(
      `/terms/${selectedTerm.id}/gas`
    );

    setGasPayments(
      result.payments || []
    );

  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setLoading(false);
  }
}

  // ==========================================================
  // LOAD EMPLOYEE PAYMENTS
  // ==========================================================

  async function loadEmployeePayments(
    employeeId
  ) {

    if (!selectedTerm) return;

    try {

      setLoading(true);

      const result = await apiRequest(
        `/terms/${selectedTerm.id}/employees/${employeeId}/payments`
      );

      setPayments(result.data || []);

    } catch (error) {

      setErrorMessage(error.message);

    } finally {

      setLoading(false);

    }
  }


  // ==========================================================
  // LOAD EMPLOYEE SUMMARY
  // ==========================================================

  async function loadEmployeeSummary(
    employeeId
  ) {

    if (!selectedTerm) return;

    try {

      setLoading(true);

      const result = await apiRequest(
        `/terms/${selectedTerm.id}/employees/${employeeId}/summary`
      );

      setEmployeeSummary(
        result.data || null
      );

    } catch (error) {

      setErrorMessage(error.message);

    } finally {

      setLoading(false);

    }
  }


  // ==========================================================
  // LOGIN
  // ==========================================================

  async function handleLogin(event) {

  if (event) {
    event.preventDefault();
  }

  setAuthError("");
  setAuthMessage("");
  setAuthLoading(true);

  try {

    const loginData =
      loginType === "employee"
        ? {
            login_type: "employee",
            username: loginUsername.trim(),
            password: loginPassword,
          }
        : {
            login_type: "admin",
            email: loginEmail.trim(),
            password: loginPassword,
          };

    const result = await apiRequest(
      "/auth/login",
      {
        method: "POST",
        body: JSON.stringify(loginData),
      }
    );

    // --------------------------------------------------------
    // SAVE TOKEN
    // --------------------------------------------------------

    localStorage.setItem(
      "pathwheelers_token",
      result.token
    );

    // --------------------------------------------------------
    // SAVE USER
    // --------------------------------------------------------

    localStorage.setItem(
      "pathwheelers_user",
      JSON.stringify(result.user)
    );

    // --------------------------------------------------------
    // UPDATE APP STATE
    // --------------------------------------------------------

    setToken(result.token);

    setCurrentUser(
      result.user
    );

    // --------------------------------------------------------
// EMPLOYEE LOGIN
// --------------------------------------------------------

if (
  result.user?.role === "employee"
) {

  setPage("employee-dashboard");

  return;
}

    // --------------------------------------------------------
    // ADMIN LOGIN
    // --------------------------------------------------------

    setPage("dashboard");

  } catch (error) {

    setAuthError(
      error.message
    );

  } finally {

    setAuthLoading(false);

  }
}
  // ==========================================================
  // SEND LOGIN CODE
  // ==========================================================

  async function sendLoginCode() {

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);

    try {

      const result = await apiRequest(
        "/auth/send-code",
        {
          method: "POST",
          body: JSON.stringify({
            email: loginEmail,
          }),
        }
      );

      setOtpSent(true);

      setDevelopmentCode(
        result.data?.development_code || ""
      );

      setAuthMessage(
        "Verification code sent to your email."
      );

    } catch (error) {

      setAuthError(error.message);

    } finally {

      setAuthLoading(false);

    }
  }


  // ==========================================================
  // VERIFY LOGIN CODE
  // ==========================================================

  async function verifyLoginCode() {

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);

    try {

      const result = await apiRequest(
        "/auth/verify-code",
        {
          method: "POST",
          body: JSON.stringify({
            email: loginEmail,
            code: otp,
          }),
        }
      );

      localStorage.setItem(
        "pathwheelers_token",
        result.data.token
      );

      setToken(result.data.token);

      setCurrentUser(
        result.data.user
      );

      setOtpSent(false);
      setOtp("");
      setDevelopmentCode("");

      setPage("dashboard");

    } catch (error) {

      setAuthError(error.message);

    } finally {

      setAuthLoading(false);

    }
  }


  // ==========================================================
  // REGISTER ADMIN
  // ==========================================================

  async function handleRegister(event) {

    if (event) {
  event.preventDefault();
}

    setAuthError("");
    setAuthMessage("");
    setAuthLoading(true);

    try {

      await apiRequest(
        "/auth/register-admin",
        {
          method: "POST",
          body: JSON.stringify({
            full_name: registerName,
            email: registerEmail,
            password: registerPassword,
          }),
        }
      );

      setAuthMode("login");

      setLoginEmail(
        registerEmail
      );

      setLoginPassword("");

      setAuthMessage(
        "Administrator account created. You can now sign in."
      );

    } catch (error) {

      setAuthError(error.message);

    } finally {

      setAuthLoading(false);

    }
  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  function logout() {

    localStorage.removeItem(
      "pathwheelers_token"
    );

    setToken(null);
    setCurrentUser(null);

    setSelectedYear(null);
    setSelectedTerm(null);

    setPage("dashboard");
  }


  // ==========================================================
  // YEAR CREATION
  // ==========================================================

  async function createYear(event) {
  if (event) {
    event.preventDefault();
  }

    setErrorMessage("");
    setNotice("");

    try {

      setLoading(true);

      const result = await apiRequest(
        "/years",
        {
          method: "POST",
          body: JSON.stringify({
            year: Number(newYear),
          }),
        }
      );

      setNotice(
        result.message ||
        "New year created successfully."
      );

      setShowYearModal(false);

      await loadYears();

    } catch (error) {

      setErrorMessage(error.message);

    } finally {

      setLoading(false);

    }
  }


  // ==========================================================
  // SELECT YEAR
  // ==========================================================

  function openYear(year) {

    setSelectedYear(year);

    setSelectedTerm(null);

    setPage("year");

    setMobileMenuOpen(false);

  }


  // ==========================================================
  // SELECT TERM
  // ==========================================================

  function openTerm(term) {

    setSelectedTerm(term);

    setPage("term");

    setMobileMenuOpen(false);

  }


  // ==========================================================
  // SELECT TERM COMPONENT
  // ==========================================================

  function openTermSection(section) {

    setPage(section);

    setMobileMenuOpen(false);

  }


  // ==========================================================
  // CREATE EMPLOYEE
  // ==========================================================

async function createEmployee(event) {
  if (event) {
    event.preventDefault();
  }

    try {

      setLoading(true);
      setErrorMessage("");
      setNotice("");

      const result = await apiRequest(
        "/employees",
        {
          method: "POST",
          body: JSON.stringify(
            employeeForm
          ),
        }
      );

      setNotice(
        result.message ||
        "Employee created successfully."
      );

      setEmployeeForm({
        full_name: "",
        email: "",
        phone: "",
        profile_picture: "",
      });

      setShowEmployeeModal(false);

      await loadEmployees();

    } catch (error) {

      setErrorMessage(error.message);

    } finally {

      setLoading(false);

    }
  }


  // ==========================================================
  // ATTENDANCE STATUS
  // ==========================================================
  function setEmployeeAmount(employeeId, amount) {
  setAttendanceAmounts((previous) => ({
    ...previous,
    [employeeId]: amount,
  }));
}

  function setEmployeeAttendance(
    employeeId,
    status
  ) {

    setAttendanceDraft(
      (previous) => ({
        ...previous,
        [employeeId]: status,
      })
    );

  }

function setEmployeeAmount(
  employeeId,
  amount
) {

  setAttendanceAmounts(
    (previous) => ({
      ...previous,
      [employeeId]: amount,
    })
  );

}


  function setEmployeeNote(
    employeeId,
    note
  ) {

    setAttendanceNotes(
      (previous) => ({
        ...previous,
        [employeeId]: note,
      })
    );

  }


  // ==========================================================
  // SAVE ALL ATTENDANCE
  // ==========================================================

  async function saveAllAttendance() {

  if (!selectedTerm) return;

  const records = employees
    .filter(
      (employee) =>
        employee.is_active !== false
    )
    .map((employee) => ({
      employee_id: employee.id,

      status:
        attendanceDraft[employee.id] ||
        "absent",

      amount_earned:
        attendanceAmounts[employee.id] === "" ||
        attendanceAmounts[employee.id] === undefined ||
        attendanceAmounts[employee.id] === null
          ? 0
          : Number(attendanceAmounts[employee.id]),

      notes:
        attendanceNotes[employee.id] ||
        "",
    }));

  try {

    setLoading(true);
    setErrorMessage("");
    setNotice("");

    const result = await apiRequest(
      "/attendance/bulk",
      {
        method: "POST",

        body: JSON.stringify({
          term_id: selectedTerm.id,

          attendance_date:
            attendanceDate,

          records,
        }),
      }
    );

    setNotice(
      result.message ||
      "Attendance saved successfully."
    );

    await loadAttendance();

  } catch (error) {

    setErrorMessage(error.message);

  } finally {

    setLoading(false);

  }
}

  // ==========================================================
  // ADD GAS
  // ==========================================================

 async function addGasPayment(event) {
  if (event) {
    event.preventDefault();
  }

    if (!selectedTerm) return;

    try {

      setGasLoading(true);
      setErrorMessage("");
      setNotice("");

      const result = await apiRequest(
        "/gas",
        {
          method: "POST",
          body: JSON.stringify({
            term_id: selectedTerm.id,
            amount: Number(gasAmount),
          }),
        }
      );

      setGasAmount("");

      setNotice(
        result.message ||
        "Gas payment recorded."
      );

      await loadGasPayments();

    } catch (error) {

      setErrorMessage(error.message);

    } finally {

      setGasLoading(false);

    }
  }


  // ==========================================================
  // OPEN EMPLOYEE PAYMENT
  // ==========================================================

  async function openEmployeePayment(
    employee
  ) {

    setSelectedEmployee(employee);

    setPage("employee-payment");

    await loadEmployeePayments(
      employee.id
    );

    await loadEmployeeSummary(
      employee.id
    );

  }


  // ==========================================================
  // OPEN PAYMENT MODAL
  // ==========================================================

  function openPaymentModal() {
  if (!selectedEmployee || !selectedTerm) {
    setErrorMessage(
      "Please select an employee and term before making a payment."
    );
    return;
  }

  setPaymentModal({
    employee: selectedEmployee,
    term: selectedTerm,
  });

  setPaymentMethod(null);
  setPaymentAmount("");
  setPaymentMessage("");
  setPaymentPreview(null);
}


  // ==========================================================
  // CLOSE PAYMENT MODAL
  // ==========================================================

  function closePaymentModal() {

  setPaymentModal(false);

  setPaymentMethod(null);

  setPaymentAmount("");

  setPaymentMessage("");

  setPaymentPreview(null);

}


  // ==========================================================
  // CASH PAYMENT
  // ==========================================================

  async function submitCashPayment() {

    if (!selectedEmployee || !selectedTerm)
      return;

    try {

      setPaymentProcessing(true);
      setErrorMessage("");

      const result = await apiRequest(
        "/payments/cash",
        {
          method: "POST",
          body: JSON.stringify({
            employee_id:
              selectedEmployee.id,
            term_id:
              selectedTerm.id,
            amount:
              Number(paymentAmount),
          }),
        }
      );

      setNotice(
        result.message ||
        "Cash payment recorded."
      );

      closePaymentModal();

      await loadEmployeePayments(
        selectedEmployee.id
      );

      await loadEmployeeSummary(
        selectedEmployee.id
      );

    } catch (error) {

      setErrorMessage(error.message);

    } finally {

      setPaymentProcessing(false);

    }
  }


  // ==========================================================
  // M-PESA PREVIEW
  // ==========================================================

  async function previewMpesa() {
  if (!selectedEmployee || !selectedTerm) {
    setErrorMessage(
      "Please select an employee and term first."
    );
    return;
  }

  try {
    setPaymentProcessing(true);
    setErrorMessage("");
    setNotice("");

    const result = await apiRequest(
      "/payments/mpesa/preview",
      {
        method: "POST",
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          term_id: selectedTerm.id,
          message: paymentMessage,
        }),
      }
    );

    const preview =
      result.preview ||
      result.transaction ||
      result.data ||
      null;

    if (!preview) {
      throw new Error(
        "The M-Pesa transaction could not be read."
      );
    }

    setPaymentPreview(preview);

  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setPaymentProcessing(false);
  }
}


  // ==========================================================
  // RECORD M-PESA
  // ==========================================================

  async function recordMpesaPayment() {
  if (!selectedEmployee || !selectedTerm) {
    setErrorMessage(
      "Please select an employee and term first."
    );
    return;
  }

  if (!paymentMessage.trim()) {
    setErrorMessage(
      "Please paste the M-Pesa transaction message."
    );
    return;
  }

  try {
    setPaymentProcessing(true);
    setErrorMessage("");
    setNotice("");

    const result = await apiRequest(
      "/payments/mpesa",
      {
        method: "POST",
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          term_id: selectedTerm.id,
          message: paymentMessage,
          transaction: paymentPreview,
        }),
      }
    );

    setNotice(
      result.message ||
      "M-Pesa payment recorded successfully."
    );

    /*
     * IMPORTANT:
     * Refresh the employee record BEFORE closing the modal.
     */
    await loadEmployeePayments(
      selectedEmployee.id
    );

    await loadEmployeeSummary(
      selectedEmployee.id
    );

    closePaymentModal();

  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setPaymentProcessing(false);
  }
}
  // ==========================================================
  // BANK PREVIEW
  // ==========================================================

  async function previewBank() {
  if (!selectedEmployee || !selectedTerm) {
    setErrorMessage(
      "Please select an employee and term first."
    );
    return;
  }

  try {
    setPaymentProcessing(true);
    setErrorMessage("");
    setNotice("");

    const result = await apiRequest(
      "/payments/bank/preview",
      {
        method: "POST",
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          term_id: selectedTerm.id,
          message: paymentMessage,
        }),
      }
    );

    const preview =
      result.preview ||
      result.transaction ||
      result.data ||
      null;

    if (!preview) {
      throw new Error(
        "The bank transaction could not be read."
      );
    }

    setPaymentPreview(preview);

  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setPaymentProcessing(false);
  }
}


  // ==========================================================
  // RECORD BANK PAYMENT
  // ==========================================================

  async function recordBankPayment() {
  if (!selectedEmployee || !selectedTerm) {
    setErrorMessage(
      "Please select an employee and term first."
    );
    return;
  }

  if (!paymentMessage.trim()) {
    setErrorMessage(
      "Please paste the bank transaction message."
    );
    return;
  }

  try {
    setPaymentProcessing(true);
    setErrorMessage("");
    setNotice("");

    const result = await apiRequest(
      "/payments/bank",
      {
        method: "POST",
        body: JSON.stringify({
          employee_id: selectedEmployee.id,
          term_id: selectedTerm.id,
          message: paymentMessage,
          transaction: paymentPreview,
        }),
      }
    );

    setNotice(
      result.message ||
      "Bank payment recorded successfully."
    );

    /*
     * Refresh first.
     */
    await loadEmployeePayments(
      selectedEmployee.id
    );

    await loadEmployeeSummary(
      selectedEmployee.id
    );

    closePaymentModal();

  } catch (error) {
    setErrorMessage(error.message);
  } finally {
    setPaymentProcessing(false);
  }
}
  // ==========================================================
  // FILTERED EMPLOYEES
  // ==========================================================

  const filteredEmployees = useMemo(() => {

    const search =
      attendanceSearch
        .trim()
        .toLowerCase();

    if (!search) {
      return employees;
    }

    return employees.filter(
      (employee) =>
        employee.full_name
          ?.toLowerCase()
          .includes(search) ||
        employee.email
          ?.toLowerCase()
          .includes(search) ||
        employee.phone
          ?.toLowerCase()
          .includes(search)
    );

  }, [
    employees,
    attendanceSearch,
  ]);


  // ==========================================================
  // PRESENT COUNT
  // ==========================================================

  const presentCount = useMemo(() => {

    return employees.filter(
      (employee) =>
        attendanceDraft[employee.id] ===
        "present"
    ).length;

  }, [
    employees,
    attendanceDraft,
  ]);


  // ==========================================================
  // ABSENT COUNT
  // ==========================================================

  const absentCount = useMemo(() => {

    return employees.filter(
      (employee) =>
        attendanceDraft[employee.id] ===
        "absent"
    ).length;

  }, [
    employees,
    attendanceDraft,
  ]);


  // ==========================================================
  // TOTAL GAS
  // ==========================================================

  const totalGas = useMemo(() => {

    return gasPayments.reduce(
      (total, record) =>
        total + Number(record.amount || 0),
      0
    );

  }, [gasPayments]);


  // ==========================================================
  // ADMIN CHECK
  // ==========================================================

  const isAdmin =
    currentUser?.role === "admin";


  // ==========================================================
  // EMPLOYEE CHECK
  // ==========================================================

  const isEmployee =
    currentUser?.role === "employee";


  // ==========================================================
  // NOT LOGGED IN
  // ==========================================================

  if (!token || !currentUser) {

    return (
  <AuthScreen
  authMode={authMode}
  setAuthMode={setAuthMode}

  // ==========================================================
  // ADMIN LOGIN
  // ==========================================================

  loginEmail={loginEmail}
  setLoginEmail={setLoginEmail}

  // ==========================================================
  // EMPLOYEE LOGIN
  // ==========================================================

  loginUsername={loginUsername}
  setLoginUsername={setLoginUsername}

  loginType={loginType}
  setLoginType={setLoginType}

  loginPassword={loginPassword}
  setLoginPassword={setLoginPassword}

  // ==========================================================
  // EXISTING OTP STATE
  // ==========================================================

  otp={otp}
  setOtp={setOtp}

  otpSent={otpSent}
  setOtpSent={setOtpSent}

  developmentCode={developmentCode}
  setDevelopmentCode={setDevelopmentCode}

  // ==========================================================
  // REGISTRATION
  // ==========================================================

  registerName={registerName}
  setRegisterName={setRegisterName}

  registerEmail={registerEmail}
  setRegisterEmail={setRegisterEmail}

  registerPassword={registerPassword}
  setRegisterPassword={setRegisterPassword}

  // ==========================================================
  // AUTH STATUS
  // ==========================================================

  authLoading={authLoading}
  authError={authError}
  authMessage={authMessage}
  setAuthMessage={setAuthMessage}

  // ==========================================================
  // HANDLERS
  // ==========================================================

  handleLogin={handleLogin}
  sendLoginCode={sendLoginCode}
  verifyLoginCode={verifyLoginCode}
  handleRegister={handleRegister}
/>);

  }


  // ==========================================================
  // MAIN APPLICATION
  // ==========================================================

  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="pw-app">

        <Sidebar
          page={page}
          setPage={setPage}
          currentUser={currentUser}
          selectedYear={selectedYear}
          selectedTerm={selectedTerm}
          logout={logout}
          mobileMenuOpen={
            mobileMenuOpen
          }
          setMobileMenuOpen={
            setMobileMenuOpen
          }
        />

        <main className="pw-main">

          <TopBar
            currentUser={currentUser}
            selectedYear={selectedYear}
            selectedTerm={selectedTerm}
            setMobileMenuOpen={
              setMobileMenuOpen
            }
          />

          <div className="pw-content">

            {(notice || errorMessage) && (
              <div
                className={
                  notice
                    ? "pw-alert success"
                    : "pw-alert error"
                }
              >
                <span>
                  {notice || errorMessage}
                </span>

                <button
                  onClick={() => {
                    setNotice("");
                    setErrorMessage("");
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {page === "dashboard" && (
              <DashboardPage
                years={years}
                employees={employees}
                isAdmin={isAdmin}
                openYear={openYear}
                setShowYearModal={
                  setShowYearModal
                }
                setShowEmployeeModal={
                  setShowEmployeeModal
                }
              />
            )}

            {page === "employee-dashboard" && (
  <EmployeeDashboardPage
    years={years}
    user={currentUser}
    apiRequest={apiRequest}
    setPage={setPage}
  />
)}

            {page === "year" && (
              <YearPage
                year={selectedYear}
                openTerm={openTerm}
                setPage={setPage}
              />
            )}

            {page === "term" && (
              <TermPage
                year={selectedYear}
                term={selectedTerm}
                openTermSection={
                  openTermSection
                }
                setPage={setPage}
              />
            )}


{page === "attendance" && (

  <AttendancePage

    setPage={setPage}

    year={selectedYear}

    term={selectedTerm}

    employees={
      filteredEmployees
    }

    attendanceDate={
      attendanceDate
    }

    setAttendanceDate={
      setAttendanceDate
    }

    attendanceDraft={
      attendanceDraft
    }

    attendanceAmounts={
      attendanceAmounts
    }

    attendanceNotes={
      attendanceNotes
    }

    setEmployeeAttendance={
      setEmployeeAttendance
    }

    setEmployeeAmount={
      setEmployeeAmount
    }

    setEmployeeNote={
      setEmployeeNote
    }

    saveAllAttendance={
      saveAllAttendance
    }

    attendanceSearch={
      attendanceSearch
    }

    setAttendanceSearch={
      setAttendanceSearch
    }

    presentCount={
      presentCount
    }

    absentCount={
      absentCount
    }

    loading={
      loading
    }

    attendance={
      attendance
    }

  />

)}


            {page === "payments" && (
     <PaymentsPage
  employees={employees}
  selectedYear={selectedYear}
  selectedTerm={selectedTerm}
  openEmployeePayment={openEmployeePayment}
  isAdmin={isAdmin}
  onAddEmployee={() => setShowEmployeeModal(true)}
  setPage={setPage}
  setPaymentModal={setPaymentModal}
/>
            )}

            

            {page === "employee-payment" && (
  <EmployeePaymentPage
  employee={selectedEmployee}
  summary={employeeSummary}
  payments={payments}
  selectedYear={selectedYear}
  selectedTerm={selectedTerm}
  isAdmin={isAdmin}
  setPage={setPage}
  openPaymentModal={openPaymentModal}
/>
            )}

            {page === "gas" && (
  <GasPaymentsPage
    selectedYear={selectedYear}
    selectedTerm={selectedTerm}
    gasPayments={gasPayments}
    gasAmount={gasAmount}
    setGasAmount={setGasAmount}
    addGasPayment={addGasPayment}
    gasLoading={gasLoading}
    setPage={setPage}
  />
)}
            {page === "guide" && (
              <ManualGuidePage />
            )}

          </div>

        </main>


        {showYearModal && (
          <YearModal
            newYear={newYear}
            setNewYear={setNewYear}
            createYear={createYear}
            close={() =>
              setShowYearModal(false)
            }
            loading={loading}
          />
        )}


        {showEmployeeModal && (
  <EmployeeModal
    showEmployeeModal={showEmployeeModal}
    employeeForm={employeeForm}
    setEmployeeForm={setEmployeeForm}
    createEmployee={createEmployee}
    setShowEmployeeModal={setShowEmployeeModal}
  />
)}

        {paymentModal && (
  <PaymentModal
    paymentModal={paymentModal}
    paymentMethod={paymentMethod}
    setPaymentMethod={setPaymentMethod}
    paymentAmount={paymentAmount}
    setPaymentAmount={setPaymentAmount}
    paymentMessage={paymentMessage}
    setPaymentMessage={setPaymentMessage}
    paymentPreview={paymentPreview}
    paymentProcessing={paymentProcessing}
    closePaymentModal={closePaymentModal}
    submitCashPayment={submitCashPayment}
    previewMpesa={previewMpesa}
    recordMpesaPayment={recordMpesaPayment}
    previewBank={previewBank}
    recordBankPayment={recordBankPayment}
  />
)}
      </div>
    </>
  );
}


// ============================================================
// AUTH SCREEN
// ============================================================


function AuthScreen(props) {

  const {
    authMode,
    setAuthMode,

    // ---------------------------------------------------------
    // ADMIN LOGIN
    // ---------------------------------------------------------
    loginEmail,
    setLoginEmail,

    // ---------------------------------------------------------
    // EMPLOYEE LOGIN
    // ---------------------------------------------------------
    loginUsername,
    setLoginUsername,

    loginPassword,
    setLoginPassword,

    // ---------------------------------------------------------
    // LOGIN TYPE
    // ---------------------------------------------------------
    loginType,
    setLoginType,

    authLoading,
    authError,
    authMessage,

    // ---------------------------------------------------------
    // ADMIN REGISTRATION
    // ---------------------------------------------------------
    registerName,
    setRegisterName,

    registerEmail,
    setRegisterEmail,

    registerPassword,
    setRegisterPassword,

    handleLogin,
    handleRegister,
  } = props;


  return (
    <>
      <style>{GLOBAL_CSS}</style>

      <div className="auth-screen">

        {/* =====================================================
            ORBITING PATHWHEELERS WHEELS
            ===================================================== */}

        <div className="wheel-brand-animation">

  <div className="orbit-wheel orbit-wheel-top">
    <img src="/wheel.jpg" alt="" />
  </div>

  <div className="orbit-wheel orbit-wheel-right">
    <img src="/wheel.jpg" alt="" />
  </div>

  <div className="orbit-wheel orbit-wheel-bottom">
    <img src="/wheel.jpg" alt="" />
  </div>

  <div className="orbit-wheel orbit-wheel-left">
    <img src="/wheel.jpg" alt="" />
  </div>

  <div className="wheel-brand-text">

    <div className="wheel-brand-main">
      PATHWHEELERS
    </div>

    <div className="wheel-brand-sub">
      ENTERPRISES 2.0
    </div>

  </div>

</div>

        {/* =====================================================
            BACKGROUND DECORATIONS
            ===================================================== */}

        <div className="auth-decoration auth-red-one" />

        <div className="auth-decoration auth-red-two" />


        {/* =====================================================
            LOGIN / REGISTER CARD
            ===================================================== */}

        <div className="auth-card">

          {/* =================================================
              BRAND HEADER
              ================================================= */}

          <div className="brand-mark">
            PW
          </div>

          <div className="auth-brand">
            PATH<span>WHEELERS</span>
          </div>

          <div className="auth-version">
            2.0 MANAGEMENT SYSTEM
          </div>


          {/* =====================================================
              LOGIN
              ===================================================== */}

          {authMode === "login" && (
            <>

              <div className="auth-heading">

                <h1>
                  Welcome back.
                </h1>

                <p className="auth-subtitle">
                  Sign in to your PathWheelers account.
                </p>

              </div>


              {/* =================================================
                  ADMIN / EMPLOYEE SWITCH
                  ================================================= */}

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "8px",
                  padding: "5px",
                  marginBottom: "22px",
                  borderRadius: "12px",
                  background: "rgba(255,255,255,0.035)",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
              >

                {/* ADMIN */}

                <button
                  type="button"
                  onClick={() => {
                    setLoginType("admin");
                    setLoginPassword("");
                    setLoginUsername("");
                  }}
                  style={{
                    border: "none",
                    borderRadius: "9px",
                    padding: "11px 14px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    color:
                      loginType === "admin"
                        ? "#ffffff"
                        : "rgba(255,255,255,0.48)",
                    background:
                      loginType === "admin"
                        ? "linear-gradient(135deg, #b3122d, #780817)"
                        : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  ADMIN
                </button>


                {/* EMPLOYEE */}

                <button
                  type="button"
                  onClick={() => {
                    setLoginType("employee");
                    setLoginPassword("");
                    setLoginEmail("");
                  }}
                  style={{
                    border: "none",
                    borderRadius: "9px",
                    padding: "11px 14px",
                    cursor: "pointer",
                    fontWeight: 700,
                    fontSize: "12px",
                    letterSpacing: "0.08em",
                    color:
                      loginType === "employee"
                        ? "#ffffff"
                        : "rgba(255,255,255,0.48)",
                    background:
                      loginType === "employee"
                        ? "linear-gradient(135deg, #b3122d, #780817)"
                        : "transparent",
                    transition: "all 0.2s ease",
                  }}
                >
                  EMPLOYEE
                </button>

              </div>


              {/* ERROR */}

              {authError && (
                <div className="auth-error">
                  {authError}
                </div>
              )}


              {/* SUCCESS */}

              {authMessage && (
                <div className="auth-success">
                  {authMessage}
                </div>
              )}


              {/* =================================================
                  LOGIN FORM
                  ================================================= */}

              <form
                onSubmit={handleLogin}
                className="auth-form"
              >

                {/* =================================================
                    ADMIN EMAIL
                    ================================================= */}

                {loginType === "admin" && (
                  <div className="auth-field">

                    <label htmlFor="login-email">
                      EMAIL ADDRESS
                    </label>

                    <input
                      id="login-email"
                      type="email"
                      value={loginEmail}
                      onChange={(event) =>
                        setLoginEmail(
                          event.target.value
                        )
                      }
                      placeholder="Enter your email"
                      autoComplete="email"
                      required
                    />

                  </div>
                )}


                {/* =================================================
                    EMPLOYEE USERNAME
                    ================================================= */}

                {loginType === "employee" && (
                  <div className="auth-field">

                    <label htmlFor="login-username">
                      EMPLOYEE USERNAME
                    </label>

                    <input
                      id="login-username"
                      type="text"
                      value={loginUsername}
                      onChange={(event) =>
                        setLoginUsername(
                          event.target.value
                        )
                      }
                      placeholder="Enter your employee name"
                      autoComplete="username"
                      required
                    />

                    <small
                      style={{
                        display: "block",
                        marginTop: "8px",
                        color: "rgba(255,255,255,0.38)",
                        fontSize: "11px",
                        lineHeight: 1.5,
                      }}
                    >
                      Use the name created by the administrator.
                    </small>

                  </div>
                )}


                {/* =================================================
                    PASSWORD
                    ================================================= */}

                <div className="auth-field">

                  <div className="auth-field-header">

                    <label htmlFor="login-password">
                      PASSWORD
                    </label>

                  </div>

                  <input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(event) =>
                      setLoginPassword(
                        event.target.value
                      )
                    }
                    placeholder={
                      loginType === "employee"
                        ? "Enter your employee password"
                        : "Enter your password"
                    }
                    autoComplete="current-password"
                    required
                  />

                </div>


                {/* =================================================
                    SIGN IN BUTTON
                    ================================================= */}

                <button
                  type="submit"
                  className="auth-primary-button"
                  disabled={authLoading}
                >

                  {authLoading
                    ? "SIGNING IN..."
                    : loginType === "employee"
                      ? "EMPLOYEE SIGN IN"
                      : "ADMIN SIGN IN"
                  }

                </button>

              </form>


              {/* =================================================
                  REGISTER
                  ================================================= */}

              {loginType === "admin" && (
                <div className="auth-register">

                  <span>
                    Don't have an administrator account?
                  </span>

                  <button
                    type="button"
                    className="auth-link-button"
                    onClick={() => {
                      setAuthMode("register");
                    }}
                  >
                    Create account
                  </button>

                </div>
              )}

            </>
          )}


          {/* =====================================================
              REGISTER
              ===================================================== */}

          {authMode === "register" && (
            <>

              <div className="auth-heading">

                <h1>
                  Create admin account.
                </h1>

                <p className="auth-subtitle">
                  Set up your PathWheelers administrator account.
                </p>

              </div>


              {/* ERROR */}

              {authError && (
                <div className="auth-error">
                  {authError}
                </div>
              )}


              {/* SUCCESS */}

              {authMessage && (
                <div className="auth-success">
                  {authMessage}
                </div>
              )}


              {/* =================================================
                  REGISTRATION FORM
                  ================================================= */}

              <form
                onSubmit={handleRegister}
                className="auth-form"
              >

                {/* FULL NAME */}

                <div className="auth-field">

                  <label htmlFor="register-name">
                    FULL NAME
                  </label>

                  <input
                    id="register-name"
                    type="text"
                    value={registerName}
                    onChange={(event) =>
                      setRegisterName(
                        event.target.value
                      )
                    }
                    placeholder="Enter your full name"
                    autoComplete="name"
                    required
                  />

                </div>


                {/* EMAIL */}

                <div className="auth-field">

                  <label htmlFor="register-email">
                    EMAIL ADDRESS
                  </label>

                  <input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(event) =>
                      setRegisterEmail(
                        event.target.value
                      )
                    }
                    placeholder="Enter your email"
                    autoComplete="email"
                    required
                  />

                </div>


                {/* PASSWORD */}

                <div className="auth-field">

                  <label htmlFor="register-password">
                    PASSWORD
                  </label>

                  <input
                    id="register-password"
                    type="password"
                    value={registerPassword}
                    onChange={(event) =>
                      setRegisterPassword(
                        event.target.value
                      )
                    }
                    placeholder="Create a password"
                    autoComplete="new-password"
                    required
                  />

                </div>


                {/* =================================================
                    CREATE ACCOUNT
                    ================================================= */}

                <button
                  type="submit"
                  className="auth-primary-button"
                  disabled={authLoading}
                >

                  {authLoading
                    ? "CREATING ACCOUNT..."
                    : "CREATE ADMINISTRATOR ACCOUNT"
                  }

                </button>

              </form>


              {/* =================================================
                  BACK TO LOGIN
                  ================================================= */}

              <div className="auth-register">

                <span>
                  Already have an account?
                </span>

                <button
                  type="button"
                  className="auth-link-button"
                  onClick={() => {
                    setAuthMode("login");
                  }}
                >
                  Sign in
                </button>

              </div>

            </>
          )}

        </div>

      </div>
    </>
  );
}

// ============================================================
// SIDEBAR
// ============================================================

function Sidebar({
  page,
  setPage,
  currentUser,
  selectedYear,
  selectedTerm,
  logout,
  mobileMenuOpen,
  setMobileMenuOpen,
}) {
  return (
    <aside
      className={
        mobileMenuOpen
          ? "pw-sidebar mobile-open"
          : "pw-sidebar"
      }
    >

      {/* BRAND */}
      <div className="sidebar-brand">

        <div className="sidebar-logo">
          PW
        </div>

        <div className="sidebar-brand-text">

          <div className="sidebar-name">
            PATH<span>WHEELERS</span>
          </div>

          <div className="sidebar-version">
            VERSION 2.0
          </div>

        </div>

      </div>


      {/* PROFILE */}
      <div className="sidebar-profile">

        <div className="profile-avatar">

          {currentUser?.profile_picture ? (
            <img
              src={currentUser.profile_picture}
              alt=""
            />
          ) : (
            initials(
              currentUser?.full_name
            )
          )}

        </div>

        <div className="profile-info">

          <strong>
            {currentUser?.full_name || "User"}
          </strong>

          <span>
            {currentUser?.role === "admin"
              ? "Administrator"
              : "Employee"}
          </span>

        </div>

      </div>


      {/* NAVIGATION */}
      <nav className="sidebar-nav">

        <div className="nav-section-label">
          WORKSPACE
        </div>


        <button
          className={
            page === "dashboard" ||
            page === "year" ||
            page === "term"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() => {
            setPage("dashboard");
            setMobileMenuOpen(false);
          }}
        >

          <span className="nav-icon dashboard-icon">
            <span></span>
          </span>

          <span className="nav-label">
            Dashboard
          </span>

          {(page === "dashboard" ||
            page === "year" ||
            page === "term") && (
            <span className="nav-active-line"></span>
          )}

        </button>


        <button
          className={
            page === "guide"
              ? "nav-item active"
              : "nav-item"
          }
          onClick={() => {
            setPage("guide");
            setMobileMenuOpen(false);
          }}
        >

          <span className="nav-icon guide-icon">
            ?
          </span>

          <span className="nav-label">
            Manual Guide
          </span>

          {page === "guide" && (
            <span className="nav-active-line"></span>
          )}

        </button>

      </nav>


      {/* BOTTOM */}
      <div className="sidebar-bottom">

        {selectedYear && (
          <div className="sidebar-context">

            <div className="context-heading">
              CURRENT YEAR
            </div>

            <div className="context-year">
              {selectedYear.year}
            </div>

            {selectedTerm && (
              <div className="context-term">
                {selectedTerm.name}
              </div>
            )}

          </div>
        )}


        <button
          className="logout-button"
          onClick={logout}
        >

          <span className="logout-icon">
            <span></span>
          </span>

          <span>
            Logout
          </span>

        </button>

      </div>


      {/* MOBILE CLOSE */}
      <button
        className="sidebar-close"
        onClick={() =>
          setMobileMenuOpen(false)
        }
        aria-label="Close menu"
      >
        <span></span>
        <span></span>
      </button>

    </aside>
  );
}

function TopBar({
  currentUser,
  selectedYear,
  selectedTerm,
  setMobileMenuOpen,
}) {
  const userName =
    currentUser?.full_name || "Administrator";

  const userRole =
    currentUser?.role === "admin"
      ? "Administrator"
      : "Employee";

  return (
    <header className="pw-topbar">

      {/* MOBILE MENU */}
      <button
        className="mobile-menu-button"
        onClick={() =>
          setMobileMenuOpen(true)
        }
        aria-label="Open menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>


      {/* LEFT SIDE */}
      <div className="topbar-context">

        <div className="topbar-brand">
          <span className="topbar-brand-name">
            PathWheelers
          </span>

          <span className="topbar-brand-version">
            2.0
          </span>
        </div>


        <div className="topbar-divider"></div>


        <div className="topbar-location">

          <span className="topbar-location-main">
            {selectedTerm
              ? selectedTerm.name
              : selectedYear
              ? selectedYear.year
              : "Dashboard"}
          </span>

          {(selectedYear || selectedTerm) && (
            <div className="topbar-breadcrumb">

              {selectedYear && (
                <span>
                  {selectedYear.year}
                </span>
              )}

              {selectedTerm && (
                <>
                  <span className="breadcrumb-separator">
                    /
                  </span>

                  <span>
                    {selectedTerm.name}
                  </span>
                </>
              )}

            </div>
          )}

        </div>

      </div>


      {/* RIGHT SIDE */}
      <div className="topbar-actions">

        <div className="topbar-status">
          <span className="status-dot"></span>
          <span>ONLINE</span>
        </div>


        <div className="topbar-divider vertical"></div>


        <div className="topbar-user">

          <div className="topbar-user-text">

            <strong>
              {userName}
            </strong>

            <span>
              {userRole}
            </span>

          </div>


          <div className="topbar-avatar">

            {currentUser?.profile_picture ? (
              <img
                src={
                  currentUser.profile_picture
                }
                alt=""
              />
            ) : (
              initials(userName)
            )}

          </div>


          <span className="topbar-chevron">
            ↓
          </span>

        </div>

      </div>

    </header>
  );
}

// ============================================================
// DASHBOARD PAGE
// ============================================================

function DashboardPage({
  years,
  employees,
  isAdmin,
  openYear,
  setShowYearModal,
  setShowEmployeeModal,
}) {
  const currentYear =
    years.find((year) => year.is_current) || years[0];

  return (
    <div className="page-shell">

      {/* =====================================================
          HERO
      ===================================================== */}

      <div className="hero-banner">

        <p className="eyebrow">
          CONTROL CENTER
        </p>

        <h2>
          Welcome back
        </h2>

        <p>
          Manage your work years, employees,
          attendance and payments from one
          centralized workspace.
        </p>

      </div>


      {/* =====================================================
          PAGE HEADING
      ===================================================== */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            ACADEMIC MANAGEMENT
          </p>

          <h1>
            Dashboard
          </h1>

          <p className="page-description">
            Select a year to manage its terms,
            attendance and payments.
          </p>

        </div>

        {isAdmin && (
          <button
            className="primary-button"
            onClick={() =>
              setShowYearModal(true)
            }
          >
            + Add New Year
          </button>
        )}

      </div>


      {/* =====================================================
          EMPTY STATE
      ===================================================== */}

      {years.length === 0 ? (

        <div className="empty-state">

          <div className="empty-icon">
            +
          </div>

          <h3>
            No years yet
          </h3>

          <p>
            Start PathWheelers by creating
            your first management year.
          </p>

          {isAdmin && (
            <button
              className="primary-button"
              style={{ marginTop: "18px" }}
              onClick={() =>
                setShowYearModal(true)
              }
            >
              Create First Year
            </button>
          )}

        </div>

      ) : (

        <>

          {/* =================================================
              YEAR SECTION HEADER
          ================================================= */}

          <div className="section-header">

            <div>

              <p className="eyebrow">
                YEARS
              </p>

              <h2>
                Your work years
              </h2>

            </div>

            <span className="record-count">
              {years.length}{" "}
              {years.length === 1
                ? "year"
                : "years"}
            </span>

          </div>


          {/* =================================================
              YEAR CARDS
          ================================================= */}

          <div className="year-grid">

            {years.map((year) => {

              const isCurrent =
                currentYear?.id === year.id;

              const termCount =
                year.terms?.length || 3;

              return (
                <button
                  key={year.id}
                  className={
                    isCurrent
                      ? "year-card current"
                      : "year-card"
                  }
                  onClick={() =>
                    openYear(year)
                  }
                >

                  <div className="year-card-top">

                    {year.is_current ? (
                      <span className="current-badge">
                        CURRENT
                      </span>
                    ) : (
                      <span className="year-status">
                        ARCHIVED
                      </span>
                    )}

                    <span className="year-arrow">
                      →
                    </span>

                  </div>


                  <div className="year-number">
                    {year.year}
                  </div>


                  <div className="year-card-bottom">

                    <span>
                      {termCount} terms
                    </span>

                    <span>
                      View year →
                    </span>

                  </div>

                </button>
              );
            })}


            {/* =============================================
                ADD YEAR
            ============================================= */}

            {isAdmin && (
              <button
                className="add-year-card"
                onClick={() =>
                  setShowYearModal(true)
                }
              >

                <div className="add-year-symbol">
                  +
                </div>

                <strong>
                  Add New Year
                </strong>

                <span>
                  Start a new management year
                </span>

              </button>
            )}

          </div>


          {/* =================================================
              OVERVIEW
          ================================================= */}

          <div className="content-section">

            <div className="section-header">

              <div>

                <p className="eyebrow">
                  OVERVIEW
                </p>

                <h2>
                  Workspace summary
                </h2>

              </div>

            </div>


            <div className="dashboard-overview">

              {/* ===========================================
                  ACTIVE YEARS
              =========================================== */}

              <div className="overview-card">

                <div className="overview-label">
                  ACTIVE YEARS
                </div>

                <div className="overview-value">
                  {years.length}
                </div>

                <div className="overview-line" />

                <div className="overview-description">
                  Management years available
                </div>

              </div>


              {/* ===========================================
                  EMPLOYEES
              =========================================== */}

              <div className="overview-card">

                <div className="overview-label">
                  ACTIVE EMPLOYEES
                </div>

                <div className="overview-value">
                  {employees.length}
                </div>

                <div className="overview-line" />

                <div className="overview-description">
                  Employees in your workforce
                </div>

              </div>


              {/* ===========================================
                  WORKFORCE
              =========================================== */}

              {isAdmin && (
                <div className="overview-card action-card">

                  <div className="overview-label">
                    WORKFORCE
                  </div>

                  <div className="overview-action-text">
                    Manage employees
                  </div>

                  <p className="overview-description">
                    Add employees and maintain
                    workforce information.
                  </p>

                  <button
                    className="outline-button"
                    onClick={() =>
                      setShowEmployeeModal(true)
                    }
                  >
                    + Add Employee
                  </button>

                </div>
              )}

            </div>

          </div>

        </>

      )}

    </div>
  );
}

// ============================================================
// EMPLOYEE DASHBOARD
// ============================================================

function EmployeeDashboardPage({
  years,
  user,
  apiRequest,
  setPage,
}) {

  const [selectedYear, setSelectedYear] =
    useState(null);

  const [selectedTerm, setSelectedTerm] =
    useState(null);

  const [summary, setSummary] =
    useState(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // ----------------------------------------------------------
  // CURRENT YEAR
  // ----------------------------------------------------------

  const currentYear =
    years.find(
      (year) => year.is_current
    ) || years[0] || null;

  // ----------------------------------------------------------
  // EMPLOYEE ID
  // ----------------------------------------------------------

  const employeeId =
    user?.employee_id;

  // ----------------------------------------------------------
  // OPEN YEAR
  // ----------------------------------------------------------

  function openEmployeeYear(year) {

    setSelectedYear(year);
    setSelectedTerm(null);
    setSummary(null);
    setError("");
  }

  // ----------------------------------------------------------
  // OPEN TERM
  // ----------------------------------------------------------

  async function openEmployeeTerm(
    year,
    term
  ) {

    if (!employeeId) {

      setError(
        "Your employee account is not linked to an employee record."
      );

      return;
    }

    try {

      setLoading(true);
      setError("");

      setSelectedYear(year);
      setSelectedTerm(term);
      setSummary(null);

      const result =
        await apiRequest(
          `/terms/${term.id}/employees/${employeeId}/summary`
        );

      setSummary(
        result.summary ||
        result.data ||
        null
      );

    } catch (error) {

      setError(
        error.message ||
        "Failed to load your term summary."
      );

    } finally {

      setLoading(false);
    }
  }

  // ----------------------------------------------------------
  // BACK TO YEARS
  // ----------------------------------------------------------

  function backToYears() {

    setSelectedYear(null);
    setSelectedTerm(null);
    setSummary(null);
    setError("");
  }

  // ----------------------------------------------------------
  // BACK TO TERMS
  // ----------------------------------------------------------

  function backToTerms() {

    setSelectedTerm(null);
    setSummary(null);
    setError("");
  }

  // ----------------------------------------------------------
  // NO YEARS
  // ----------------------------------------------------------

  if (!years.length) {

    return (
      <div className="page-shell">

        <div className="hero-banner">

          <p className="eyebrow">
            EMPLOYEE WORKSPACE
          </p>

          <h2>
            Welcome back
          </h2>

          <p>
            Your PathWheelers records will appear
            here when a management year is available.
          </p>

        </div>


        <div className="empty-state">

          <div className="empty-icon">
            —
          </div>

          <h3>
            No management year available
          </h3>

          <p>
            Your administrator has not created
            a management year yet.
          </p>

        </div>

      </div>
    );
  }

  // ----------------------------------------------------------
  // TERM SUMMARY SCREEN
  // ----------------------------------------------------------

  if (
    selectedYear &&
    selectedTerm
  ) {

    const totalDays =
      Number(
        summary?.total_days_worked ??
        summary?.days_worked ??
        summary?.days_present ??
        0
      );

    const totalEarned =
      Number(
        summary?.total_earned ??
        summary?.amount_earned ??
        0
      );

    const totalPaid =
      Number(
        summary?.total_paid ??
        0
      );

    const remaining =
      Number(
        summary?.remaining_to_be_paid ??
        summary?.remaining ??
        Math.max(
          totalEarned - totalPaid,
          0
        )
      );

    const paymentStatus =
      summary?.payment_status ||
      (
        remaining > 0
          ? "Pending"
          : remaining < 0
            ? "Overpaid"
            : "Paid"
      );

    return (
      <div className="page-shell">

        {/* ===================================================
            HEADER
        =================================================== */}

        <div className="page-heading">

          <div>

            <button
              type="button"
              className="outline-button"
              onClick={backToTerms}
              style={{
                marginBottom: "16px",
              }}
            >
              ← Back to Terms
            </button>

            <p className="eyebrow">
              MY RECORDS
            </p>

            <h1>
              {selectedTerm.name}
            </h1>

            <p className="page-description">
              {selectedYear.year} • Personal
              attendance and payment summary
            </p>

          </div>

        </div>


        {/* ===================================================
            ERROR
        =================================================== */}

        {error && (
          <div
            className="auth-error"
            style={{
              marginBottom: "24px",
            }}
          >
            {error}
          </div>
        )}


        {/* ===================================================
            LOADING
        =================================================== */}

        {loading ? (

          <div className="empty-state">

            <div className="empty-icon">
              ...
            </div>

            <h3>
              Loading your records
            </h3>

            <p>
              Please wait while we load your
              attendance and payment information.
            </p>

          </div>

        ) : (

          <>

            {/* =================================================
                SUMMARY CARDS
            ================================================= */}

            <div className="dashboard-overview">

              {/* DAYS WORKED */}

              <div className="overview-card">

                <div className="overview-label">
                  DAYS WORKED
                </div>

                <div className="overview-value">
                  {totalDays}
                </div>

                <div className="overview-line" />

                <div className="overview-description">
                  Days marked present
                </div>

              </div>


              {/* TOTAL EARNED */}

              <div className="overview-card">

                <div className="overview-label">
                  TOTAL EARNED
                </div>

                <div className="overview-value">
                  KSh{" "}
                  {totalEarned.toLocaleString(
                    "en-KE",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>

                <div className="overview-line" />

                <div className="overview-description">
                  Total earnings for this term
                </div>

              </div>


              {/* TOTAL PAID */}

              <div className="overview-card">

                <div className="overview-label">
                  TOTAL PAID
                </div>

                <div className="overview-value">
                  KSh{" "}
                  {totalPaid.toLocaleString(
                    "en-KE",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>

                <div className="overview-line" />

                <div className="overview-description">
                  Payments received
                </div>

              </div>


              {/* REMAINING */}

              <div className="overview-card">

                <div className="overview-label">
                  REMAINING
                </div>

                <div
                  className="overview-value"
                  style={{
                    color:
                      remaining > 0
                        ? "#ff4d5e"
                        : "#69d391",
                  }}
                >
                  KSh{" "}
                  {remaining.toLocaleString(
                    "en-KE",
                    {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    }
                  )}
                </div>

                <div className="overview-line" />

                <div className="overview-description">
                  {paymentStatus}
                </div>

              </div>

            </div>


            {/* =================================================
                PAYMENT STATUS
            ================================================= */}

            <div
              className="content-section"
              style={{
                marginTop: "30px",
              }}
            >

              <div className="section-header">

                <div>

                  <p className="eyebrow">
                    PAYMENT STATUS
                  </p>

                  <h2>
                    {paymentStatus}
                  </h2>

                </div>

              </div>

              <div
                style={{
                  padding: "24px",
                  borderRadius: "18px",
                  border:
                    "1px solid rgba(255,255,255,0.07)",
                  background:
                    "rgba(255,255,255,0.025)",
                }}
              >

                <p
                  style={{
                    margin: 0,
                    color:
                      "rgba(255,255,255,0.68)",
                    lineHeight: 1.7,
                  }}
                >
                  Your records for{" "}
                  <strong>
                    {selectedTerm.name}
                  </strong>{" "}
                  of{" "}
                  <strong>
                    {selectedYear.year}
                  </strong>
                  {" "}
                  are shown above.
                </p>

              </div>

            </div>

          </>
        )}

      </div>
    );
  }

  // ----------------------------------------------------------
  // TERM SELECTION SCREEN
  // ----------------------------------------------------------

  if (selectedYear) {

    const terms =
      selectedYear.terms || [];

    return (
      <div className="page-shell">

        <div className="page-heading">

          <div>

            <button
              type="button"
              className="outline-button"
              onClick={backToYears}
              style={{
                marginBottom: "16px",
              }}
            >
              ← Back to Years
            </button>

            <p className="eyebrow">
              MY YEAR
            </p>

            <h1>
              {selectedYear.year}
            </h1>

            <p className="page-description">
              Select a term to view your
              attendance and payment records.
            </p>

          </div>

        </div>


        {error && (
          <div
            className="auth-error"
            style={{
              marginBottom: "24px",
            }}
          >
            {error}
          </div>
        )}


        <div className="section-header">

          <div>

            <p className="eyebrow">
              TERMS
            </p>

            <h2>
              Select a term
            </h2>

          </div>

          <span className="record-count">
            {terms.length}{" "}
            {terms.length === 1
              ? "term"
              : "terms"}
          </span>

        </div>


        {terms.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              —
            </div>

            <h3>
              No terms available
            </h3>

            <p>
              There are no terms available for
              this year yet.
            </p>

          </div>

        ) : (

          <div
            className="year-grid"
            style={{
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >

            {terms.map((term, index) => (

              <button
                key={term.id}
                type="button"
                className="year-card"
                onClick={() =>
                  openEmployeeTerm(
                    selectedYear,
                    term
                  )
                }
                style={{
                  minHeight: "190px",
                  textAlign: "left",
                }}
              >

                <div className="year-card-top">

                  <span className="current-badge">
                    TERM {term.term_number || index + 1}
                  </span>

                  <span className="year-arrow">
                    →
                  </span>

                </div>


                <div
                  className="year-number"
                  style={{
                    fontSize: "30px",
                  }}
                >
                  {term.name ||
                    `Term ${term.term_number || index + 1}`}
                </div>


                <div className="year-card-bottom">

                  <span>
                    View my records
                  </span>

                  <span>
                    →
                  </span>

                </div>

              </button>

            ))}

          </div>

        )}

      </div>
    );
  }

  // ----------------------------------------------------------
  // YEAR SELECTION / DEFAULT EMPLOYEE DASHBOARD
  // ----------------------------------------------------------

  return (
    <div className="page-shell">

      {/* =====================================================
          HERO
          ===================================================== */}

      <div className="hero-banner">

        <p className="eyebrow">
          EMPLOYEE WORKSPACE
        </p>

        <h2>
          Welcome back
          {user?.full_name
            ? `, ${user.full_name}`
            : ""}
        </h2>

        <p>
          View your work years, attendance,
          earnings and payments from one
          centralized workspace.
        </p>

      </div>


      {/* =====================================================
          PAGE HEADING
          ===================================================== */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            MY ACADEMIC YEARS
          </p>

          <h1>
            My Dashboard
          </h1>

          <p className="page-description">
            Select a year to view your terms
            and personal records.
          </p>

        </div>

        <button
          type="button"
          className="outline-button"
          onClick={() =>
            openEmployeeYear(
              currentYear
            )
          }
        >
          Open Current Year
        </button>

      </div>


      {/* =====================================================
          YEARS
          ===================================================== */}

      <div className="section-header">

        <div>

          <p className="eyebrow">
            YEARS
          </p>

          <h2>
            Available years
          </h2>

        </div>

        <span className="record-count">
          {years.length}{" "}
          {years.length === 1
            ? "year"
            : "years"}
        </span>

      </div>


      <div className="year-grid">

        {years.map((year) => {

          const isCurrent =
            currentYear?.id === year.id;

          const termCount =
            year.terms?.length || 3;

          return (

            <button
              key={year.id}
              type="button"
              className={
                isCurrent
                  ? "year-card current"
                  : "year-card"
              }
              onClick={() =>
                openEmployeeYear(year)
              }
            >

              <div className="year-card-top">

                {year.is_current ? (

                  <span className="current-badge">
                    CURRENT
                  </span>

                ) : (

                  <span className="year-status">
                    ARCHIVED
                  </span>

                )}

                <span className="year-arrow">
                  →
                </span>

              </div>


              <div className="year-number">
                {year.year}
              </div>


              <div className="year-card-bottom">

                <span>
                  {termCount} terms
                </span>

                <span>
                  View year →
                </span>

              </div>

            </button>

          );
        })}

      </div>


      {/* =====================================================
          QUICK OVERVIEW
          ===================================================== */}

      <div
        className="content-section"
        style={{
          marginTop: "32px",
        }}
      >

        <div className="section-header">

          <div>

            <p className="eyebrow">
              MY ACCOUNT
            </p>

            <h2>
              Employee information
            </h2>

          </div>

        </div>


        <div className="dashboard-overview">

          <div className="overview-card">

            <div className="overview-label">
              EMPLOYEE
            </div>

            <div
              className="overview-action-text"
            >
              {user?.full_name || "Employee"}
            </div>

            <p className="overview-description">
              Your PathWheelers account
            </p>

          </div>


          <div className="overview-card">

            <div className="overview-label">
              CURRENT YEAR
            </div>

            <div
              className="overview-value"
            >
              {currentYear?.year || "—"}
            </div>

            <p className="overview-description">
              Current management year
            </p>

          </div>


          <div className="overview-card">

            <div className="overview-label">
              TERMS
            </div>

            <div
              className="overview-value"
            >
              {currentYear?.terms?.length || 0}
            </div>

            <p className="overview-description">
              Terms available this year
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}
// ============================================================
// YEAR PAGE
// ============================================================

function YearPage({
  year,
  openTerm,
  setPage,
}) {

  if (!year) {

    return (
      <div className="empty-state">
        <h2>
          No year selected
        </h2>

        <button
          className="primary-button"
          onClick={() =>
            setPage("dashboard")
          }
        >
          Back to Dashboard
        </button>
      </div>
    );

  }


  return (
    <div className="page">

      <button
        className="back-button"
        onClick={() =>
          setPage("dashboard")
        }
      >
        ← Dashboard
      </button>


      <div className="year-hero">

        <div>

          <p className="eyebrow">
            MANAGEMENT YEAR
          </p>

          <h1>
            {year.year}
          </h1>

          <p>
            Select a term to continue.
          </p>

        </div>


        <div className="year-hero-mark">
          {String(year.year).slice(-2)}
        </div>

      </div>


      <div className="section-title-row">

        <div>

          <p className="eyebrow">
            ACADEMIC TERMS
          </p>

          <h2>
            {year.year} terms
          </h2>

        </div>

      </div>


      <div className="term-grid">

        {(year.terms || []).map(
          (term) => (

            <button
              key={term.id}
              className="term-card"
              onClick={() =>
                openTerm(term)
              }
            >

              <div className="term-number">
                0{term.term_number}
              </div>

              <div className="term-info">

                <span>
                  TERM
                </span>

                <h3>
                  {term.name}
                </h3>

                <p>
                  Manage this term
                </p>

              </div>

              <div className="term-arrow">
                →
              </div>

            </button>

          )
        )}

      </div>

    </div>
  );
}


// ============================================================
// TERM PAGE
// ============================================================

function TermPage({
  year,
  term,
  openTermSection,
  setPage,
}) {

  if (!term) {

    return (
      <div className="empty-state">

        <h2>
          No term selected
        </h2>

        <button
          className="primary-button"
          onClick={() =>
            setPage("dashboard")
          }
        >
          Back to Dashboard
        </button>

      </div>
    );

  }


  return (
    <div className="page">

      <button
        className="back-button"
        onClick={() =>
          setPage("year")
        }
      >
        ← {year?.year || "Year"}
      </button>


      <div className="term-hero">

        <div>

          <p className="eyebrow">
            {year?.year} / TERM
          </p>

          <h1>
            {term.name}
          </h1>

          <p>
            Choose what you want to
            manage.
          </p>

        </div>

        <div className="term-hero-number">
          0{term.term_number}
        </div>

      </div>


      <div className="component-grid">

        <button
          className="component-card"
          onClick={() =>
            openTermSection(
              "attendance"
            )
          }
        >

          <div className="component-icon">
            ✓
          </div>

          <div>

            <span>
              RECORD
            </span>

            <h3>
              Attendance
            </h3>

            <p>
              Mark employees present
              or absent and view
              attendance history.
            </p>

          </div>

          <div className="component-arrow">
            →
          </div>

        </button>


        <button
          className="component-card"
          onClick={() =>
            openTermSection(
              "payments"
            )
          }
        >

          <div className="component-icon">
            K
          </div>

          <div>

            <span>
              PAYROLL
            </span>

            <h3>
              Payments
            </h3>

            <p>
              View employee earnings,
              payments and balances.
            </p>

          </div>

          <div className="component-arrow">
            →
          </div>

        </button>


        <button
          className="component-card"
          onClick={() =>
            openTermSection(
              "gas"
            )
          }
        >

          <div className="component-icon">
            G
          </div>

          <div>

            <span>
              EXPENSE
            </span>

            <h3>
              Gas Payments
            </h3>

            <p>
              Record and review gas
              expenses for this term.
            </p>

          </div>

          <div className="component-arrow">
            →
          </div>

        </button>

      </div>


      <div className="term-note">

        <span>
          {year?.year} · {term.name}
        </span>

        <p>
          All records created here
          remain permanently attached
          to this year and term.
        </p>

      </div>

    </div>
  );
}


// ============================================================
// ATTENDANCE PAGE
// ============================================================

function AttendancePage({
  year,
  term,
  employees,
  attendanceDate,
  setAttendanceDate,
  attendanceDraft,
  attendanceAmounts,
  attendanceNotes,
  setEmployeeAttendance,
  setEmployeeAmount,
  setEmployeeNote,
  saveAllAttendance,
  attendanceSearch,
  setAttendanceSearch,
  presentCount,
  absentCount,
  loading,
  setPage,
  attendance,
}) {

  const historyCount =
    attendance.length;


  return (
    <div className="page">

      <button
        type="button"
        className="back-button"
        onClick={() => setPage("term")}
      >
        ← {term?.name || "Term"}
      </button>


      <div className="page-heading">

        <div>

          <p className="eyebrow">
            {year?.year} / {term?.name}
          </p>

          <h1>
            Attendance
          </h1>

          <p className="page-description">
            Record attendance and the amount
            earned by each employee for a
            specific date.
          </p>

        </div>


        <button
          className="primary-button compact"
          onClick={saveAllAttendance}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save Attendance"}
        </button>

      </div>


      <div className="attendance-toolbar">

        <div className="date-control">

          <label>
            DATE
          </label>

          <input
            type="date"
            value={attendanceDate}
            onChange={(event) =>
              setAttendanceDate(
                event.target.value
              )
            }
          />

        </div>


        <div className="attendance-search">

          <label>
            SEARCH EMPLOYEES
          </label>

          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={attendanceSearch}
            onChange={(event) =>
              setAttendanceSearch(
                event.target.value
              )
            }
          />

        </div>


        <div className="attendance-stat present">

          <span>
            PRESENT
          </span>

          <strong>
            {presentCount}
          </strong>

        </div>


        <div className="attendance-stat absent">

          <span>
            ABSENT
          </span>

          <strong>
            {absentCount}
          </strong>

        </div>

      </div>


      <div className="attendance-table">

        <div className="table-header">

          <span>
            EMPLOYEE
          </span>

          <span>
            STATUS
          </span>

          <span>
            AMOUNT EARNED
          </span>

          <span>
            NOTES
          </span>

        </div>


        {employees.length === 0 ? (

          <div className="table-empty">

            <div>
              —
            </div>

            <h3>
              No employees found
            </h3>

            <p>
              Add employees from the
              dashboard first.
            </p>

          </div>

        ) : (

          employees.map(
            (employee) => {

              const status =
                attendanceDraft[
                  employee.id
                ] || "absent";

              const amount =
                attendanceAmounts?.[
                  employee.id
                ] ?? "";

              return (
                <div
                  className="attendance-row"
                  key={employee.id}
                >

                  {/* EMPLOYEE */}

                  <div className="employee-cell">

                    <div className="employee-avatar">

                      {employee.profile_picture ? (

                        <img
                          src={
                            employee.profile_picture
                          }
                          alt=""
                        />

                      ) : (

                        initials(
                          employee.full_name
                        )

                      )}

                    </div>


                    <div>

                      <strong>
                        {employee.full_name}
                      </strong>

                      <span>
                        {employee.phone ||
                          employee.email ||
                          "Employee"}
                      </span>

                    </div>

                  </div>


                  {/* STATUS */}

                  <div className="attendance-actions">

                    <button
                      type="button"
                      className={
                        status === "present"
                          ? "status-button present active"
                          : "status-button present"
                      }
                      onClick={() =>
                        setEmployeeAttendance(
                          employee.id,
                          "present"
                        )
                      }
                    >

                      <span>
                        ✓
                      </span>

                      Present

                    </button>


                    <button
                      type="button"
                      className={
                        status === "absent"
                          ? "status-button absent active"
                          : "status-button absent"
                      }
                      onClick={() =>
                        setEmployeeAttendance(
                          employee.id,
                          "absent"
                        )
                      }
                    >

                      <span>
                        ×
                      </span>

                      Absent

                    </button>

                  </div>


                  {/* AMOUNT EARNED */}

                  <div className="attendance-amount">

                    <input
                      className="amount-input"
                      type="number"
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      value={amount}
                      onChange={(event) =>
                        setEmployeeAmount(
                          employee.id,
                          event.target.value
                        )
                      }
                    />

                  </div>


                  {/* NOTES */}

                  <input
                    className="notes-input"
                    type="text"
                    placeholder="Optional note..."
                    value={
                      attendanceNotes[
                        employee.id
                      ] || ""
                    }
                    onChange={(event) =>
                      setEmployeeNote(
                        employee.id,
                        event.target.value
                      )
                    }
                  />

                </div>
              );

            }
          )

        )}

      </div>


      <div className="attendance-footer">

        <span>
          {historyCount} historical
          attendance records loaded
        </span>

        <button
          className="primary-button"
          onClick={saveAllAttendance}
          disabled={loading}
        >
          {loading
            ? "Saving..."
            : "Save all attendance"}
        </button>

      </div>

    </div>
  );
}

function PaymentsPage({
  employees,
  selectedYear,
  selectedTerm,
  openEmployeePayment,
  isAdmin,
  onAddEmployee,
  setPage,
  setPaymentModal,
}) {
  return (
    <div className="page-shell">

      {/* BACK TO TERM */}
      <button
        className="back-button"
        onClick={() => {
          setPage("term");
        }}
      >
        ← {selectedTerm?.name || "Term"}
      </button>


      {/* PAGE HEADER */}
      <div className="page-heading">

        <div>
          <p className="eyebrow">
            {selectedYear?.year || "YEAR"} /{" "}
            {selectedTerm?.name || "TERM"}
          </p>

          <h1>
            Employee Payments
          </h1>

          <p className="page-description">
            Select an employee to view their earnings,
            payments and remaining balance for this term.
          </p>
        </div>

        {isAdmin && (
          <button
            className="primary-button"
            onClick={onAddEmployee}
          >
            + Add Employee
          </button>
        )}

      </div>


      {/* CONTEXT */}
      <div className="context-banner">

        <div>
          <span className="context-label">
            ACADEMIC PERIOD
          </span>

          <strong>
            {selectedYear?.year || "Year"} ·{" "}
            {selectedTerm?.name || "Term"}
          </strong>
        </div>

        <div className="context-status">
          <span className="status-dot" />
          Permanent records
        </div>

      </div>


      {/* EMPLOYEES */}
      <div className="employee-grid">

        {employees.length === 0 ? (

          <div className="empty-state large">

            <div className="empty-icon">
              +
            </div>

            <h3>
              No employees found
            </h3>

            <p>
              Add employees to begin tracking
              their payments for this term.
            </p>

            {isAdmin && (
              <button
                className="primary-button"
                onClick={onAddEmployee}
              >
                Add Employee
              </button>
            )}

          </div>

        ) : (

          employees.map((employee) => (

            <div
              key={employee.id}
              className="employee-payment-card"
            >

              {/* EMPLOYEE HEADER */}
              <div className="employee-card-top">

                {employee.profile_picture ? (

                  <img
                    src={employee.profile_picture}
                    alt={employee.full_name}
                    className="employee-avatar large"
                  />

                ) : (

                  <div className="employee-avatar large">
                    {initials(employee.full_name)}
                  </div>

                )}

                <div className="employee-card-arrow">
                  →
                </div>

              </div>


              {/* EMPLOYEE NAME */}
              <div className="employee-card-name">
                {employee.full_name}
              </div>


              {/* PHONE */}
              <div className="employee-card-phone">
                {employee.phone || "No phone number"}
              </div>


              {/* ACTION */}
              <div className="employee-card-footer">

                <span>
                  Payment record
                </span>

                {isAdmin ? (

      <button
  type="button"
  className="primary-button pay-button"
  onClick={() => openEmployeePayment(employee)}
>
  Pay Employee
</button>

                ) : (

                  <button
                    type="button"
                    className="outline-button"
                    onClick={() =>
                      openEmployeePayment(employee)
                    }
                  >
                    View Record →
                  </button>

                )}

              </div>

            </div>

          ))

        )}

      </div>

    </div>
  );
}


function EmployeePaymentPage({
  employee,
  summary,
  payments,
  selectedYear,
  selectedTerm,
  isAdmin,
  setPage,
  openPaymentModal,
}) {  if (!employee) {
    return (
      <div className="page-shell">
        <div className="empty-state large">
          <h3>No employee selected</h3>

          <button
            className="secondary-button"
            onClick={() => {
              setPage("payments");
            }}
          >
            ← Back to Payments
          </button>
        </div>
      </div>
    );
  }

  const totalDays =
    Number(summary?.total_days_worked || 0);

  const amountEarned =
    Number(summary?.amount_earned || 0);

  const totalPaid =
    Number(summary?.total_paid || 0);

  const remaining =
    Number(
      summary?.remaining_to_be_paid ??
        Math.max(
          amountEarned - totalPaid,
          0
        )
    );

  function handleBack() {
    setPage("payments");
  }

  

  return (
    <div className="page-shell">

      {/* BACK */}
      <button
        type="button"
        className="back-button"
        onClick={handleBack}
      >
        ← Payments
      </button>


      {/* HEADER */}
      <div className="page-heading">

        <div>

          <div className="employee-profile-heading">

            {employee.profile_picture ? (

              <img
                src={employee.profile_picture}
                alt={employee.full_name}
                className="employee-avatar xl"
              />

            ) : (

              <div className="employee-avatar xl">
                {initials(
                  employee.full_name
                )}
              </div>

            )}

            <div>

              <p className="eyebrow">
                EMPLOYEE PAYMENT RECORD
              </p>

              <h1>
                {employee.full_name}
              </h1>

              <p className="page-description">
                {employee.phone ||
                  "No phone number"}{" "}
                ·{" "}
                {selectedYear?.year ||
                  selectedTerm?.year?.year ||
                  ""}{" "}
                ·{" "}
                {selectedTerm?.name ||
                  "Term"}
              </p>

            </div>

          </div>

        </div>


        {/* ADMIN PAY BUTTON */}
     {isAdmin && (
  <button
    type="button"
    className="primary-button pay-button"
    onClick={openPaymentModal}
  >
    Pay Employee
  </button>
)}

      </div>


      {/* PAYMENT SUMMARY */}
      <div className="payment-stat-grid">

        <div className="payment-stat-card">

          <span className="stat-label">
            DAYS WORKED
          </span>

          <strong>
            {totalDays}
          </strong>

          <small>
            Present attendance records
          </small>

        </div>


        <div className="payment-stat-card">

          <span className="stat-label">
            AMOUNT EARNED
          </span>

          <strong>
            {formatMoney(amountEarned)}
          </strong>

          <small>
            Total earnings for this term
          </small>

        </div>


        <div className="payment-stat-card">

          <span className="stat-label">
            TOTAL PAID
          </span>

          <strong>
            {formatMoney(totalPaid)}
          </strong>

          <small>
            All recorded payments
          </small>

        </div>


        <div className="payment-stat-card highlight">

          <span className="stat-label">
            REMAINING
          </span>

          <strong>
            {formatMoney(remaining)}
          </strong>

          <small>
            {remaining <= 0
              ? "Fully paid"
              : "Amount still outstanding"}
          </small>

        </div>

      </div>


      {/* PAYMENT HISTORY */}
      <section className="content-section">

        <div className="section-header">

          <div>

            <p className="eyebrow">
              PAYMENT HISTORY
            </p>

            <h2>
              Recorded Payments
            </h2>

          </div>

          <span className="record-count">
            {payments?.length || 0} records
          </span>

        </div>


        {!payments ||
        payments.length === 0 ? (

          <div className="empty-state">

            <div className="empty-icon">
              —
            </div>

            <h3>
              No payments recorded
            </h3>

            <p>
              Payments made to this employee
              during this term will appear
              here.
            </p>

          </div>

        ) : (

          <div className="payment-history">

            {payments.map(
              (payment) => (

                <div
                  className="payment-history-row"
                  key={payment.id}
                >

                  <div className="payment-method-icon">

                    {payment.method ===
                    "M-Pesa"
                      ? "M"
                      : payment.method ===
                        "Bank"
                      ? "B"
                      : "C"}

                  </div>


                  <div className="payment-history-main">

                    <strong>
                      {formatMoney(
                        payment.amount
                      )}
                    </strong>

                    <span>
                      {payment.method ||
                        "Cash"}{" "}
                      ·{" "}
                      {formatDateTime(
                        payment.payment_date
                      )}
                    </span>

                  </div>


                  <div className="payment-history-reference">

                    {payment.reference ||
                      payment.mpesa_code ||
                      payment.transaction_code ||
                      "Recorded payment"}

                  </div>


                  <div className="payment-status-badge success">
                    Paid
                  </div>

                </div>

              )
            )}

          </div>

        )}

      </section>

    </div>
  );
}

function GasPaymentsPage({
  selectedYear,
  selectedTerm,
  gasPayments,
  gasAmount,
  setGasAmount,
  addGasPayment,
  gasLoading,
  setPage,
}) {
  if (!selectedTerm) {
    return (
      <div className="page-shell">
        <div className="empty-state large">
          <h3>No term selected</h3>

          <button
            type="button"
            className="secondary-button"
            onClick={() => setPage("year")}
          >
            ← Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <button
            type="button"
            className="back-button"
            onClick={() => setPage("term")}
          >
            ← Back to Term
          </button>

          <p className="eyebrow">GAS PAYMENTS</p>

          <h1>Gas Payments</h1>

          <p className="page-subtitle">
            Record and track gas expenses for this term.
          </p>
        </div>
      </div>

      {/* YEAR / TERM */}
      <div className="context-card">
        <div>
          <span className="context-label">ACADEMIC YEAR</span>
          <strong>{selectedYear?.year}</strong>
        </div>

        <div>
          <span className="context-label">TERM</span>
          <strong>
            {selectedTerm?.name ||
              `Term ${selectedTerm?.term_number}`}
          </strong>
        </div>
      </div>

      {/* ADD GAS PAYMENT */}
      <div className="gas-entry-card">
        <div className="gas-entry-header">
          <div>
            <p className="eyebrow">NEW RECORD</p>

            <h2>Add Gas Payment</h2>

            <p>
              Enter the amount paid for gas. The date and
              selected term will be recorded automatically.
            </p>
          </div>
        </div>

        <form
          onSubmit={addGasPayment}
          className="gas-entry-form"
        >
          <div className="gas-input-group">
            <label htmlFor="gasAmount">
              Gas Amount
            </label>

            <div className="amount-input-wrapper">
              <span>KES</span>

              <input
                id="gasAmount"
                type="number"
                min="1"
                step="0.01"
                value={gasAmount}
                onChange={(event) =>
                  setGasAmount(event.target.value)
                }
                placeholder="Enter amount"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="primary-button gas-add-button"
            disabled={
              gasLoading ||
              !gasAmount ||
              Number(gasAmount) <= 0
            }
          >
            {gasLoading
              ? "Saving..."
              : "+ Add Gas Payment"}
          </button>
        </form>
      </div>

      {/* RECORDS */}
      <div className="section-heading">
        <div>
          <p className="eyebrow">PAYMENT HISTORY</p>

          <h2>Gas Records</h2>
        </div>

        <div className="record-count">
          {gasPayments?.length || 0} Records
        </div>
      </div>

      {gasPayments && gasPayments.length > 0 ? (
        <div className="gas-records">
          {gasPayments.map((record) => {
            const amount = Number(
              record.amount || 0
            );

            const dateValue =
              record.payment_date ||
              record.created_at ||
              record.date;

            let formattedDate = "Date unavailable";

            if (dateValue) {
              const date = new Date(dateValue);

              if (!Number.isNaN(date.getTime())) {
                formattedDate =
                  date.toLocaleString("en-KE", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  });
              }
            }

            return (
              <div
                className="gas-record-card"
                key={record.id}
              >
                <div className="gas-record-icon">
                  ⛽
                </div>

                <div className="gas-record-main">
                  <span className="gas-record-label">
                    GAS PAYMENT
                  </span>

                  <strong>
                    KES{" "}
                    {amount.toLocaleString(
                      "en-KE",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>

                  <span className="gas-record-date">
                    {formattedDate}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="empty-state large gas-empty">
          <div className="empty-icon">⛽</div>

          <h3>No gas payments yet</h3>

          <p>
            Add your first gas payment using the form
            above.
          </p>
        </div>
      )}
    </div>
  );
}

function ManualGuidePage({ isAdmin }) {
  return (
    <div className="page-shell">
      <div className="page-heading">
        <div>
          <p className="eyebrow">PATHWHEELERS 2.0</p>
          <h1>Manual Guide</h1>
          <p className="page-description">
            A simple guide to managing years, terms, attendance and payments.
          </p>
        </div>
      </div>

      <div className="guide-grid">
        <GuideCard
          number="01"
          title="Create a year"
          text="From Dashboard, select Add New Year. Existing years are never replaced or overwritten."
        />

        <GuideCard
          number="02"
          title="Open a term"
          text="Open a year and select Term 1, Term 2 or Term 3. All records created inside that term stay attached to it."
        />

        <GuideCard
          number="03"
          title="Record attendance"
          text="Open Attendance, choose the date, mark employees Present or Absent, add notes where necessary and save."
        />

        <GuideCard
          number="04"
          title="Make payments"
          text="Open Payments, select an employee and review their earnings and previous payments. Admins can use Pay Employee."
        />

        <GuideCard
          number="05"
          title="Choose payment method"
          text="Payments can be recorded through Cash, M-Pesa or Bank. M-Pesa and Bank messages can be previewed before confirmation."
        />

        <GuideCard
          number="06"
          title="Record gas"
          text="Open Gas Payments and enter only the amount. The system automatically records the date, time and selected term."
        />

        <GuideCard
          number="07"
          title="Historical records"
          text="When a new academic year is created, previous years and their terms remain available. Nothing is transferred or deleted automatically."
        />

        <GuideCard
          number="08"
          title={isAdmin ? "Administrator access" : "Employee access"}
          text={
            isAdmin
              ? "Administrators can manage employees, attendance, gas expenses and employee payments."
              : "Employees can view their own payment information and history but cannot make payments."
          }
        />
      </div>

      <div className="guide-warning">
        <div className="guide-warning-icon">!</div>

        <div>
          <strong>Important</strong>
          <p>
            Always make sure the correct year and term are selected before
            recording attendance, payments or gas expenses.
          </p>
        </div>
      </div>
    </div>
  );
}


function GuideCard({ number, title, text }) {
  return (
    <div className="guide-card">
      <div className="guide-number">{number}</div>

      <div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </div>
  );
}

function PaymentModal({
  paymentModal,
  paymentMethod,
  setPaymentMethod,
  paymentAmount,
  setPaymentAmount,
  paymentMessage,
  setPaymentMessage,
  paymentPreview,
  paymentProcessing,
  closePaymentModal,
  submitCashPayment,
  previewMpesa,
  recordMpesaPayment,
  previewBank,
  recordBankPayment,
}) {
  if (!paymentModal) return null;

  const employee = paymentModal.employee;

  return (
    <div className="modal-overlay" onMouseDown={closePaymentModal}>
      <div
        className="modal-card payment-modal"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">MAKE PAYMENT</p>
            <h2>{employee?.full_name}</h2>
            <p>
              {paymentModal.term?.year?.year} ·{" "}
              {paymentModal.term?.name}
            </p>
          </div>

          <button
            className="modal-close"
            onClick={closePaymentModal}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {!paymentMethod ? (
          <div className="payment-method-selection">
            <p className="method-title">
              Select payment method
            </p>

            <div className="method-grid">
              <button
                className="method-card"
                onClick={() => setPaymentMethod("Cash")}
              >
                <div className="method-icon cash">C</div>

                <div>
                  <strong>Cash</strong>
                  <span>Enter the amount manually</span>
                </div>

                <b>→</b>
              </button>

              <button
                className="method-card"
                onClick={() => setPaymentMethod("M-Pesa")}
              >
                <div className="method-icon mpesa">M</div>

                <div>
                  <strong>M-Pesa</strong>
                  <span>Paste an M-Pesa transaction message</span>
                </div>

                <b>→</b>
              </button>

              <button
                className="method-card"
                onClick={() => setPaymentMethod("Bank")}
              >
                <div className="method-icon bank">B</div>

                <div>
                  <strong>Bank</strong>
                  <span>Paste a bank transaction message</span>
                </div>

                <b>→</b>
              </button>
            </div>
          </div>
        ) : (
          <div className="payment-entry">
            <button
              className="change-method"
              onClick={() => {
                setPaymentMethod("");
                setPaymentAmount("");
                setPaymentMessage("");
              }}
            >
              ← Change payment method
            </button>

            <div className="selected-method-banner">
              <div
                className={`method-icon ${
                  paymentMethod === "M-Pesa"
                    ? "mpesa"
                    : paymentMethod === "Bank"
                    ? "bank"
                    : "cash"
                }`}
              >
                {paymentMethod === "M-Pesa"
                  ? "M"
                  : paymentMethod === "Bank"
                  ? "B"
                  : "C"}
              </div>

              <div>
                <span>PAYMENT METHOD</span>
                <strong>{paymentMethod}</strong>
              </div>
            </div>

            {paymentMethod === "Cash" && (
              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  submitCashPayment();
                }}
              >
                <label className="field-label">
                  Amount to pay
                </label>

                <div className="money-input large">
                  <span>KSh</span>

                  <input
                    type="number"
                    min="1"
                    step="0.01"
                    value={paymentAmount}
                    onChange={(event) =>
                      setPaymentAmount(event.target.value)
                    }
                    placeholder="0.00"
                    required
                  />
                </div>

                <div className="payment-note">
                  <span>✓</span>
                  Cash payments are recorded immediately.
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closePaymentModal}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="primary-button"
                    disabled={paymentProcessing}
                  >
                    {paymentProcessing
                      ? "Recording..."
                      : "Confirm Cash Payment"}
                  </button>
                </div>
              </form>
            )}

            {paymentMethod === "M-Pesa" && (
              <div>
                <label className="field-label">
                  Paste M-Pesa message
                </label>

                <textarea
                  className="message-input"
                  value={paymentMessage}
                  onChange={(event) =>
                    setPaymentMessage(event.target.value)
                  }
                  placeholder="Paste the complete M-Pesa confirmation message here..."
                  rows="6"
                />

                {!paymentPreview && (
                  <div className="payment-note">
                    <span>i</span>
                    Paste the complete message so the system can extract
                    the amount, transaction code, phone and recipient.
                  </div>
                )}

                {paymentPreview && (
                  <TransactionPreview
                    preview={paymentPreview}
                    employee={employee}
                  />
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closePaymentModal}
                  >
                    Cancel
                  </button>

                  {!paymentPreview ? (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={previewMpesa}
                      disabled={
                        paymentProcessing ||
                        !paymentMessage.trim()
                      }
                    >
                      {paymentProcessing
                        ? "Checking..."
                        : "Preview Transaction"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={recordMpesaPayment}
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing
                        ? "Recording..."
                        : "Confirm M-Pesa Payment"}
                    </button>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === "Bank" && (
              <div>
                <label className="field-label">
                  Paste bank message
                </label>

                <textarea
                  className="message-input"
                  value={paymentMessage}
                  onChange={(event) =>
                    setPaymentMessage(event.target.value)
                  }
                  placeholder="Paste the complete bank transaction message here..."
                  rows="6"
                />

                {!paymentPreview && (
                  <div className="payment-note">
                    <span>i</span>
                    Paste the complete bank confirmation message so the
                    system can extract the transaction details.
                  </div>
                )}

                {paymentPreview && (
                  <TransactionPreview
                    preview={paymentPreview}
                    employee={employee}
                  />
                )}

                <div className="modal-actions">
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={closePaymentModal}
                  >
                    Cancel
                  </button>

                  {!paymentPreview ? (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={previewBank}
                      disabled={
                        paymentProcessing ||
                        !paymentMessage.trim()
                      }
                    >
                      {paymentProcessing
                        ? "Checking..."
                        : "Preview Transaction"}
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="primary-button"
                      onClick={recordBankPayment}
                      disabled={paymentProcessing}
                    >
                      {paymentProcessing
                        ? "Recording..."
                        : "Confirm Bank Payment"}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


function TransactionPreview({ preview, employee }) {
  const data = preview?.transaction || preview || {};

  const amount =
    data.amount ??
    data.transaction_amount ??
    data.paid_amount ??
    0;

  const code =
    data.transaction_code ??
    data.mpesa_code ??
    data.reference ??
    data.reference_number ??
    "—";

  const receiver =
    data.receiver ??
    data.recipient ??
    data.name ??
    "—";

  const phone =
    data.phone ??
    data.recipient_phone ??
    data.receiver_phone ??
    "—";

  const transactionDate =
    data.transaction_date ??
    data.date ??
    data.payment_date ??
    null;

  return (
    <div className="transaction-preview">
      <div className="preview-header">
        <div>
          <p className="eyebrow">TRANSACTION REVIEW</p>
          <h3>Confirm details</h3>
        </div>

        <span className="preview-check">✓</span>
      </div>

      <div className="preview-grid">
        <div className="preview-item">
          <span>Amount</span>
          <strong>{formatMoney(amount)}</strong>
        </div>

        <div className="preview-item">
          <span>Transaction code</span>
          <strong>{code}</strong>
        </div>

        <div className="preview-item">
          <span>Receiver</span>
          <strong>{receiver}</strong>
        </div>

        <div className="preview-item">
          <span>Phone</span>
          <strong>{phone}</strong>
        </div>

        {transactionDate && (
          <div className="preview-item">
            <span>Date</span>
            <strong>{formatDateTime(transactionDate)}</strong>
          </div>
        )}

        <div className="preview-item">
          <span>Employee</span>
          <strong>{employee?.full_name || "—"}</strong>
        </div>
      </div>

      {preview?.matched_employee === false && (
        <div className="preview-warning">
          <strong>Employee mismatch</strong>
          <p>
            The transaction does not appear to match this employee.
            Check the recipient before confirming.
          </p>
        </div>
      )}
    </div>
  );
}


function YearModal({
  showYearModal,
  newYear,
  setNewYear,
  createYear,
  setShowYearModal,
}) {
  if (!showYearModal) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={() => setShowYearModal(false)}
    >
      <div
        className="modal-card small"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">ACADEMIC STRUCTURE</p>
            <h2>Add New Year</h2>
            <p>
              A new year will automatically receive Term 1,
              Term 2 and Term 3.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={() => setShowYearModal(false)}
          >
            ×
          </button>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            createYear();
          }}
        >
          <label className="field-label">
            Academic year
          </label>

          <input
            className="text-input"
            type="number"
            min="2000"
            max="2100"
            value={newYear}
            onChange={(event) => setNewYear(event.target.value)}
            placeholder="2027"
            required
          />

          <div className="year-creation-preview">
            <span>New structure</span>

            <div className="term-preview-list">
              <span>Term 1</span>
              <span>Term 2</span>
              <span>Term 3</span>
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowYearModal(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Create Year
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


function EmployeeModal({
  showEmployeeModal,
  employeeForm,
  setEmployeeForm,
  createEmployee,
  setShowEmployeeModal,
}) {
  if (!showEmployeeModal) return null;

  return (
    <div
      className="modal-overlay"
      onMouseDown={() => setShowEmployeeModal(false)}
    >
      <div
        className="modal-card"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <p className="eyebrow">TEAM MANAGEMENT</p>
            <h2>Add Employee</h2>
            <p>
              Create the employee profile once. Their historical
              records will remain attached to their account.
            </p>
          </div>

          <button
            className="modal-close"
            onClick={() => setShowEmployeeModal(false)}
          >
            ×
          </button>
        </div>

        <form
  onSubmit={createEmployee}
>
          <div className="form-grid">
            <div className="form-field full">
              <label className="field-label">
                Full name
              </label>

              <input
                className="text-input"
                type="text"
                value={employeeForm.full_name}
                onChange={(event) =>
                  setEmployeeForm({
                    ...employeeForm,
                    full_name: event.target.value,
                  })
                }
                placeholder="e.g. John Kamau"
                required
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                Phone number
              </label>

              <input
                className="text-input"
                type="tel"
                value={employeeForm.phone}
                onChange={(event) =>
                  setEmployeeForm({
                    ...employeeForm,
                    phone: event.target.value,
                  })
                }
                placeholder="07XXXXXXXX"
              />
            </div>

            <div className="form-field">
              <label className="field-label">
                Daily rate
              </label>

              <div className="money-input">
                <span>KSh</span>

                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={employeeForm.daily_rate}
                  onChange={(event) =>
                    setEmployeeForm({
                      ...employeeForm,
                      daily_rate: event.target.value,
                    })
                  }
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="form-field full">
              <label className="field-label">
                Profile picture URL
              </label>

              <input
                className="text-input"
                type="url"
                value={employeeForm.profile_picture}
                onChange={(event) =>
                  setEmployeeForm({
                    ...employeeForm,
                    profile_picture: event.target.value,
                  })
                }
                placeholder="https://..."
              />

              <small className="field-help">
                Optional. You can add a profile image URL later.
              </small>
            </div>
          </div>

          <div className="employee-modal-note">
            <div className="note-symbol">i</div>

            <p>
              The daily rate is used internally to calculate earnings.
              It will not be displayed on the Attendance page.
            </p>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="secondary-button"
              onClick={() => setShowEmployeeModal(false)}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-button"
            >
              Create Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Rajdhani:wght@500;600;700&display=swap');

:root {
  --bg: #050506;
  --bg-soft: #09090b;
  --panel: #101014;
  --panel-2: #141419;
  --panel-3: #19191f;

  --border: rgba(255,255,255,0.075);
  --border-bright: rgba(255,255,255,0.13);

  --red: #b3122d;
  --red-bright: #ef294b;
  --red-dark: #68091a;
  --red-soft: rgba(179,18,45,0.12);
  --red-glow: rgba(239,41,75,0.20);

  --text: #f7f7f8;
  --text-soft: #c2c2c8;
  --text-muted: #777780;

  --green: #43c879;
  --yellow: #e3b341;

  --radius: 18px;
  --radius-small: 11px;

  --sidebar-width: 250px;

  --shadow-card:
    0 18px 45px rgba(0,0,0,0.25);

  --shadow-hover:
    0 25px 65px rgba(0,0,0,0.38);

  --transition:
    transform .25s ease,
    border-color .25s ease,
    background .25s ease,
    box-shadow .25s ease;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  min-height: 100vh;

  background:
    radial-gradient(
      circle at 80% -10%,
      rgba(179,18,45,0.14),
      transparent 32%
    ),
    radial-gradient(
      circle at -10% 100%,
      rgba(179,18,45,0.07),
      transparent 30%
    ),
    linear-gradient(
      135deg,
      #050506 0%,
      #08080a 45%,
      #050506 100%
    );

  color: var(--text);
  font-family: "Inter", sans-serif;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: -1;

  background-image:
    linear-gradient(
      rgba(255,255,255,0.012) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,0.012) 1px,
      transparent 1px
    );

  background-size: 42px 42px;
  mask-image: linear-gradient(
    to bottom,
    black,
    transparent 80%
  );
}

button,
input,
textarea,
select {
  font: inherit;
}

button {
  cursor: pointer;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

img {
  max-width: 100%;
}

a {
  color: inherit;
  text-decoration: none;
}

/* ==========================================================
   APP LAYOUT
========================================================== */

.app-shell {
  min-height: 100vh;
  display: flex;
}

.main-area {
  min-width: 0;
  flex: 1;
  margin-left: var(--sidebar-width);
}

.main-content {
  min-height: calc(100vh - 74px);
  padding: 34px;
}

.page-shell {
  width: 100%;
  max-width: 1550px;
  margin: 0 auto;
}

/* ==========================================================
   SIDEBAR
========================================================== */

.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  width: var(--sidebar-width);

  background:
    linear-gradient(
      180deg,
      rgba(16,16,20,0.98),
      rgba(6,6,8,0.99)
    );

  border-right: 1px solid var(--border);

  display: flex;
  flex-direction: column;

  z-index: 100;

  box-shadow:
    20px 0 70px rgba(0,0,0,0.25);
}

.sidebar::after {
  content: "";
  position: absolute;

  top: 0;
  right: -1px;

  width: 1px;
  height: 180px;

  background:
    linear-gradient(
      transparent,
      var(--red-bright),
      transparent
    );

  opacity: .55;
}

.sidebar-brand {
  padding: 28px 23px 24px;

  border-bottom: 1px solid var(--border);
}

.brand-mark {
  width: 46px;
  height: 46px;

  border-radius: 13px;

  background:
    linear-gradient(
      145deg,
      #f02c4d 0%,
      #a80f29 45%,
      #5d0718 100%
    );

  display: flex;
  align-items: center;
  justify-content: center;

  font-family: "Rajdhani", sans-serif;
  font-size: 22px;
  font-weight: 700;

  box-shadow:
    0 10px 35px rgba(179,18,45,0.28),
    inset 0 1px rgba(255,255,255,0.18);
}

.brand-name {
  margin-top: 15px;

  font-family: "Rajdhani", sans-serif;
  font-size: 23px;
  font-weight: 700;

  letter-spacing: 2.5px;
}

.brand-version {
  margin-top: 3px;

  color: #55555e;

  font-size: 9px;
  font-weight: 600;
  letter-spacing: 2.5px;
}

.sidebar-nav {
  flex: 1;
  padding: 24px 14px;
}

.nav-section-label {
  padding: 0 12px;
  margin-bottom: 10px;

  color: #505059;

  font-size: 9px;
  font-weight: 800;
  letter-spacing: 2px;
}

.nav-button {
  position: relative;

  width: 100%;

  border: 1px solid transparent;
  background: transparent;

  color: #777780;

  padding: 14px 13px;
  margin-bottom: 6px;

  border-radius: 12px;

  display: flex;
  align-items: center;
  gap: 12px;

  text-align: left;

  transition: var(--transition);
}

.nav-button:hover {
  color: #fff;

  background:
    linear-gradient(
      90deg,
      rgba(255,255,255,0.055),
      rgba(255,255,255,0.018)
    );

  border-color: rgba(255,255,255,0.055);

  transform: translateX(2px);
}

.nav-button.active {
  color: #fff;

  background:
    linear-gradient(
      100deg,
      rgba(179,18,45,0.22),
      rgba(179,18,45,0.045)
    );

  border-color:
    rgba(239,41,75,0.16);

  box-shadow:
    inset 0 0 25px rgba(179,18,45,0.045),
    0 8px 25px rgba(0,0,0,0.18);
}

.nav-button.active::before {
  content: "";

  position: absolute;

  left: -14px;
  top: 9px;
  bottom: 9px;

  width: 3px;

  border-radius: 0 4px 4px 0;

  background:
    linear-gradient(
      to bottom,
      var(--red-bright),
      var(--red)
    );

  box-shadow:
    0 0 16px var(--red-glow);
}

.nav-icon {
  width: 25px;

  text-align: center;

  font-size: 16px;

  opacity: .9;
}

.nav-label {
  font-size: 12px;
  font-weight: 700;
}

.sidebar-footer {
  padding: 15px;

  border-top: 1px solid var(--border);
}

.sidebar-user {
  position: relative;

  padding: 13px;

  border-radius: 14px;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.045),
      rgba(255,255,255,0.015)
    );

  border: 1px solid var(--border);

  display: flex;
  align-items: center;
  gap: 10px;
}

.sidebar-user::before {
  content: "";

  position: absolute;

  left: 0;
  top: 12px;
  bottom: 12px;

  width: 2px;

  background: var(--red);

  border-radius: 3px;
}

.sidebar-user-info {
  min-width: 0;
  flex: 1;
}

.sidebar-user-name {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  font-size: 11px;
  font-weight: 700;
}

.sidebar-user-role {
  margin-top: 3px;

  color: #65656d;

  font-size: 9px;
  font-weight: 700;

  text-transform: uppercase;
  letter-spacing: 1.2px;
}

/* ==========================================================
   PREMIUM SIDEBAR
========================================================== */

.pw-sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;

  width: 248px;

  display: flex;
  flex-direction: column;

  padding: 24px 16px 18px;

  background:
    linear-gradient(
      180deg,
      #0b0b0f 0%,
      #08080b 100%
    );

  border-right:
    1px solid rgba(255, 255, 255, 0.055);

  z-index: 100;

  box-shadow:
    15px 0 45px rgba(0, 0, 0, 0.22);
}


/* BRAND */

.sidebar-brand {
  display: flex;
  align-items: center;

  gap: 12px;

  padding: 2px 8px 24px;

  border-bottom:
    1px solid rgba(255, 255, 255, 0.055);
}


.sidebar-logo {
  width: 42px;
  height: 42px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  border-radius: 12px;

  background:
    linear-gradient(
      135deg,
      #ef294b,
      #8b1028
    );

  color: #ffffff;

  font-family: "Rajdhani", sans-serif;

  font-size: 16px;
  font-weight: 900;

  letter-spacing: 1px;

  box-shadow:
    0 8px 25px rgba(239, 41, 75, 0.22);
}


.sidebar-brand-text {
  min-width: 0;
}


.sidebar-name {
  color: #ffffff;

  font-family: "Rajdhani", sans-serif;

  font-size: 17px;
  font-weight: 900;

  letter-spacing: 1px;

  line-height: 1;
}


.sidebar-name span {
  color: var(--red-bright);
}


.sidebar-version {
  margin-top: 6px;

  color: #55555d;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.5px;
}


/* PROFILE */

.sidebar-profile {
  display: flex;
  align-items: center;

  gap: 11px;

  margin: 22px 4px 24px;

  padding: 12px;

  background:
    rgba(255, 255, 255, 0.025);

  border:
    1px solid rgba(255, 255, 255, 0.055);

  border-radius: 13px;
}


.profile-avatar {
  width: 37px;
  height: 37px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  overflow: hidden;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #ef294b,
      #8b1028
    );

  color: #ffffff;

  font-family: "Rajdhani", sans-serif;

  font-size: 14px;
  font-weight: 900;
}


.profile-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.profile-info {
  min-width: 0;

  display: flex;
  flex-direction: column;

  gap: 3px;
}


.profile-info strong {
  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: #eeeeef;

  font-size: 11px;
  font-weight: 800;
}


.profile-info span {
  color: #5e5e66;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 1px;
}


/* NAVIGATION */

.sidebar-nav {
  display: flex;
  flex-direction: column;

  gap: 5px;
}


.nav-section-label {
  margin: 0 11px 9px;

  color: #46464e;

  font-size: 8px;
  font-weight: 900;

  letter-spacing: 2px;
}


.nav-item {
  position: relative;

  width: 100%;
  min-height: 47px;

  display: flex;
  align-items: center;

  gap: 12px;

  padding: 0 13px;

  color: #66666f;

  background: transparent;

  border: 1px solid transparent;

  border-radius: 11px;

  font-size: 11px;
  font-weight: 750;

  text-align: left;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}


.nav-item:hover {
  color: #eeeeef;

  background:
    rgba(255, 255, 255, 0.035);

  border-color:
    rgba(255, 255, 255, 0.045);

  transform: translateX(2px);
}


.nav-item.active {
  color: #ffffff;

  background:
    linear-gradient(
      90deg,
      rgba(239, 41, 75, 0.14),
      rgba(239, 41, 75, 0.035)
    );

  border-color:
    rgba(239, 41, 75, 0.13);
}


.nav-icon {
  width: 20px;
  height: 20px;

  display: flex;
  align-items: center;
  justify-content: center;

  flex-shrink: 0;

  color: #55555d;

  transition:
    color 0.2s ease;
}


.nav-item.active .nav-icon {
  color: var(--red-bright);
}


/* DASHBOARD ICON */

.dashboard-icon {
  position: relative;

  border:
    1.5px solid currentColor;

  border-radius: 5px;
}


.dashboard-icon::before,
.dashboard-icon::after,
.dashboard-icon span::before {
  content: "";

  position: absolute;

  background: currentColor;

  border-radius: 1px;
}


.dashboard-icon::before {
  width: 5px;
  height: 5px;

  left: 3px;
  top: 3px;
}


.dashboard-icon::after {
  width: 5px;
  height: 5px;

  right: 3px;
  bottom: 3px;
}


.dashboard-icon span::before {
  width: 5px;
  height: 5px;

  right: 3px;
  top: 3px;
}


/* GUIDE ICON */

.guide-icon {
  border:
    1.5px solid currentColor;

  border-radius: 50%;

  font-family: "Rajdhani", sans-serif;

  font-size: 13px;
  font-weight: 900;
}


/* ACTIVE INDICATOR */

.nav-active-line {
  position: absolute;

  right: 7px;

  width: 3px;
  height: 18px;

  border-radius: 4px;

  background: var(--red-bright);

  box-shadow:
    0 0 10px rgba(239, 41, 75, 0.5);
}


/* BOTTOM */

.sidebar-bottom {
  margin-top: auto;
}


.sidebar-context {
  margin: 0 4px 13px;

  padding: 13px;

  background:
    rgba(239, 41, 75, 0.045);

  border:
    1px solid rgba(239, 41, 75, 0.1);

  border-radius: 11px;
}


.context-heading {
  color: #575760;

  font-size: 7px;
  font-weight: 900;

  letter-spacing: 1.7px;
}


.context-year {
  margin-top: 5px;

  color: #ffffff;

  font-family: "Rajdhani", sans-serif;

  font-size: 21px;
  font-weight: 900;
}


.context-term {
  margin-top: 1px;

  color: var(--red-bright);

  font-size: 9px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 0.8px;
}


/* LOGOUT */

.logout-button {
  width: 100%;
  min-height: 45px;

  display: flex;
  align-items: center;

  gap: 11px;

  padding: 0 13px;

  color: #686870;

  background: transparent;

  border:
    1px solid transparent;

  border-radius: 11px;

  font-size: 10px;
  font-weight: 800;

  cursor: pointer;

  transition:
    color 0.2s ease,
    background 0.2s ease,
    border-color 0.2s ease;
}


.logout-button:hover {
  color: #ffffff;

  background:
    rgba(239, 41, 75, 0.07);

  border-color:
    rgba(239, 41, 75, 0.12);
}


.logout-icon {
  position: relative;

  width: 19px;
  height: 19px;

  display: block;

  border:
    1.5px solid currentColor;

  border-left-color: transparent;

  border-radius: 5px;
}


.logout-icon span::before {
  content: "→";

  position: absolute;

  left: -5px;
  top: -5px;

  font-size: 15px;
  font-weight: 500;
}


/* MOBILE CLOSE */

.sidebar-close {
  display: none;

  position: absolute;

  top: 16px;
  right: 14px;

  width: 32px;
  height: 32px;

  align-items: center;
  justify-content: center;

  background:
    rgba(255, 255, 255, 0.04);

  border:
    1px solid rgba(255, 255, 255, 0.08);

  border-radius: 8px;

  cursor: pointer;
}


.sidebar-close span {
  position: absolute;

  width: 14px;
  height: 1.5px;

  background: #ffffff;

  border-radius: 2px;
}


.sidebar-close span:first-child {
  transform: rotate(45deg);
}


.sidebar-close span:last-child {
  transform: rotate(-45deg);
}


/* MOBILE */

@media (max-width: 900px) {

  .pw-sidebar {
    transform: translateX(-105%);

    transition:
      transform 0.28s ease;
  }

  .pw-sidebar.mobile-open {
    transform: translateX(0);

    box-shadow:
      15px 0 50px rgba(0, 0, 0, 0.55);
  }

  .sidebar-close {
    display: flex;
  }

}

/* ==========================================================
   TOP BAR
========================================================== */

/* ==========================================================
   PATHWHEELERS TOPBAR
========================================================== */

.pw-topbar {
  height: 74px;
  min-height: 74px;

  padding: 0 34px;

  position: sticky;
  top: 0;
  z-index: 80;

  display: flex;
  align-items: center;
  justify-content: space-between;

  background:
    rgba(7, 7, 9, 0.88);

  backdrop-filter: blur(22px);

  border-bottom:
    1px solid var(--border);

  box-shadow:
    0 10px 35px rgba(0, 0, 0, 0.18);
}


/* ==========================================================
   LEFT SIDE
========================================================== */

.topbar-context {
  display: flex;
  align-items: center;

  min-width: 0;
}


.topbar-brand {
  display: flex;
  align-items: baseline;

  gap: 7px;

  white-space: nowrap;
}


.topbar-brand-name {
  color: #ffffff;

  font-family: "Rajdhani", sans-serif;

  font-size: 20px;
  font-weight: 800;

  letter-spacing: 0.8px;
}


.topbar-brand-version {
  padding: 3px 6px;

  color: var(--red-bright);

  background:
    rgba(239, 41, 75, 0.08);

  border:
    1px solid rgba(239, 41, 75, 0.22);

  border-radius: 5px;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 1px;
}


.topbar-divider {
  width: 1px;
  height: 30px;

  margin: 0 22px;

  background:
    linear-gradient(
      180deg,
      transparent,
      rgba(255, 255, 255, 0.13),
      transparent
    );
}


/* ==========================================================
   LOCATION / BREADCRUMB
========================================================== */

.topbar-location {
  min-width: 0;
}


.topbar-location-main {
  display: block;

  color: #eeeeef;

  font-size: 13px;
  font-weight: 750;

  white-space: nowrap;
}


.topbar-breadcrumb {
  display: flex;
  align-items: center;

  gap: 7px;

  margin-top: 3px;

  color: #65656d;

  font-size: 9px;
  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: 1px;
}


.topbar-breadcrumb .breadcrumb-separator {
  color: var(--red-bright);
}


/* ==========================================================
   RIGHT SIDE
========================================================== */

.topbar-actions {
  display: flex;
  align-items: center;

  flex-shrink: 0;
}


.topbar-status {
  display: flex;
  align-items: center;

  gap: 8px;

  color: #606068;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.4px;
}


.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: var(--red-bright);

  box-shadow:
    0 0 0 4px rgba(239, 41, 75, 0.08),
    0 0 14px rgba(239, 41, 75, 0.45);
}


.topbar-divider.vertical {
  height: 28px;

  margin: 0 19px;
}


/* ==========================================================
   USER
========================================================== */

.topbar-user {
  display: flex;
  align-items: center;

  gap: 11px;

  padding: 6px 8px 6px 12px;

  background:
    rgba(255, 255, 255, 0.025);

  border:
    1px solid rgba(255, 255, 255, 0.06);

  border-radius: 12px;

  transition:
    background 0.2s ease,
    border-color 0.2s ease,
    transform 0.2s ease;
}


.topbar-user:hover {
  background:
    rgba(255, 255, 255, 0.045);

  border-color:
    rgba(239, 41, 75, 0.22);

  transform:
    translateY(-1px);
}


.topbar-user-text {
  display: flex;
  flex-direction: column;

  align-items: flex-end;

  gap: 2px;
}


.topbar-user-text strong {
  max-width: 150px;

  overflow: hidden;

  text-overflow: ellipsis;

  white-space: nowrap;

  color: #ffffff;

  font-size: 11px;
  font-weight: 800;
}


.topbar-user-text span {
  color: #66666f;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;

  letter-spacing: 1.2px;
}


.topbar-avatar {
  width: 38px;
  height: 38px;

  display: flex;
  align-items: center;
  justify-content: center;

  overflow: hidden;

  border-radius: 11px;

  color: #ffffff;

  background:
    linear-gradient(
      135deg,
      #ef294b,
      #8d1028
    );

  border:
    1px solid rgba(255, 255, 255, 0.12);

  font-family: "Rajdhani", sans-serif;

  font-size: 15px;
  font-weight: 800;

  box-shadow:
    0 6px 20px rgba(239, 41, 75, 0.18);
}


.topbar-avatar img {
  width: 100%;
  height: 100%;

  object-fit: cover;
}


.topbar-chevron {
  display: flex;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;

  color: #55555d;

  font-size: 11px;
}


/* ==========================================================
   MOBILE MENU
========================================================== */

.mobile-menu-button {
  display: none;

  width: 42px;
  height: 42px;

  padding: 9px;

  flex-direction: column;
  justify-content: center;

  gap: 5px;

  background:
    rgba(255, 255, 255, 0.035);

  border:
    1px solid rgba(255, 255, 255, 0.08);

  border-radius: 10px;

  cursor: pointer;
}


.mobile-menu-button span {
  display: block;

  width: 20px;
  height: 2px;

  border-radius: 2px;

  background: #ffffff;
}


/* ==========================================================
   RESPONSIVE
========================================================== */

@media (max-width: 900px) {

  .pw-topbar {
    padding: 0 18px;
  }

  .topbar-status,
  .topbar-divider.vertical {
    display: none;
  }

}


@media (max-width: 700px) {

  .pw-topbar {
    height: 68px;
    min-height: 68px;

    padding: 0 14px;
  }

  .mobile-menu-button {
    display: flex;

    flex-shrink: 0;
  }

  .topbar-context {
    flex: 1;

    min-width: 0;
  }

  .topbar-brand,
  .topbar-divider {
    display: none;
  }

  .topbar-location-main {
    font-size: 13px;
  }

  .topbar-breadcrumb {
    font-size: 8px;
  }

  .topbar-user {
    padding: 4px;

    background: transparent;

    border: none;
  }

  .topbar-user-text,
  .topbar-chevron {
    display: none;
  }

  .topbar-avatar {
    width: 38px;
    height: 38px;
  }

}

/* ==========================================================
   PAGE HEADINGS
========================================================== */

.page-heading {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;

  gap: 25px;

  margin-bottom: 30px;
}

.page-heading h1 {
  margin: 6px 0 9px;

  font-family: "Rajdhani", sans-serif;

  font-size: 40px;
  line-height: 1;

  letter-spacing: .5px;

  text-shadow:
    0 8px 30px rgba(0,0,0,.45);
}

.page-description {
  margin: 0;

  color: #74747d;

  font-size: 12px;
  line-height: 1.75;

  max-width: 680px;
}

.eyebrow {
  margin: 0;

  color: var(--red-bright);

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 3px;
}

/* ==========================================================
   BUTTONS
========================================================== */

.primary-button,
.secondary-button,
.danger-button {
  min-height: 44px;

  padding: 0 18px;

  border-radius: 11px;

  font-size: 11px;
  font-weight: 800;

  transition: var(--transition);

  border: 1px solid transparent;
}

.primary-button {
  color: #fff;

  background:
    linear-gradient(
      135deg,
      #ed294a,
      #b3122d 55%,
      #870b21
    );

  border-color:
    rgba(255,255,255,0.08);

  box-shadow:
    0 10px 30px rgba(179,18,45,0.22),
    inset 0 1px rgba(255,255,255,0.16);
}

.primary-button:hover {
  transform: translateY(-2px);

  box-shadow:
    0 16px 38px rgba(179,18,45,0.32),
    inset 0 1px rgba(255,255,255,0.18);
}

.primary-button:active {
  transform: translateY(0);
}

.secondary-button {
  color: #bdbdc4;

  background:
    linear-gradient(
      145deg,
      #18181d,
      #111114
    );

  border-color: var(--border);
}

.secondary-button:hover {
  color: #fff;

  border-color:
    rgba(255,255,255,0.15);

  background: #1c1c21;

  transform: translateY(-1px);
}

.danger-button {
  color: #ff9aaa;

  border-color:
    rgba(239,41,75,0.25);

  background:
    rgba(179,18,45,0.08);
}

.danger-button:hover {
  background:
    rgba(179,18,45,0.15);

  border-color:
    rgba(239,41,75,0.4);
}

.back-button,
.change-method {
  border: 0;
  background: transparent;

  color: #777780;

  padding: 0;

  font-size: 11px;
  font-weight: 700;

  transition: .2s ease;
}

.back-button:hover,
.change-method:hover {
  color: var(--red-bright);
}

/* ==========================================================
   MOBILE BUTTON
========================================================== */

.mobile-menu-button {
  display: none;

  width: 40px;
  height: 40px;

  border: 1px solid var(--border);

  border-radius: 11px;

  background: #151519;

  color: #fff;

  box-shadow:
    0 8px 25px rgba(0,0,0,.2);
}

/* ==========================================================
   AVATARS
========================================================== */

.employee-avatar {
  flex-shrink: 0;

  border-radius: 50%;

  background:
    radial-gradient(
      circle at 35% 25%,
      #5d1b29,
      #1b0d12 55%,
      #0b090b
    );

  border: 1px solid rgba(239,41,75,0.28);

  display: flex;
  align-items: center;
  justify-content: center;

  color: #f3bbc5;

  font-weight: 800;

  overflow: hidden;

  box-shadow:
    0 5px 20px rgba(0,0,0,.3);
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.employee-avatar.small {
  width: 35px;
  height: 35px;
  font-size: 10px;
}

.employee-avatar.large {
  width: 58px;
  height: 58px;
  font-size: 16px;
}

.employee-avatar.xl {
  width: 78px;
  height: 78px;
  font-size: 21px;

  box-shadow:
    0 10px 35px rgba(179,18,45,.18);
}

/* ==========================================================
   RESPONSIVE FOUNDATION
========================================================== */

@media (max-width: 1100px) {
  :root {
    --sidebar-width: 220px;
  }

  .main-content {
    padding: 28px;
  }
}

@media (max-width: 850px) {
  :root {
    --sidebar-width: 0px;
  }

  .sidebar {
    width: 250px;

    transform: translateX(-100%);

    transition: transform .28s ease;
  }

  .sidebar.mobile-open {
    transform: translateX(0);

    box-shadow:
      25px 0 80px rgba(0,0,0,.5);
  }

  .main-area {
    margin-left: 0;
  }

  .mobile-menu-button {
    display: block;
  }

  .topbar {
    padding: 0 20px;
  }

  .main-content {
    padding: 24px 20px;
  }
}

@media (max-width: 600px) {
  .main-content {
    padding: 20px 15px;
  }

  .page-heading {
    flex-direction: column;
  }

  .page-heading h1 {
    font-size: 34px;
  }
}

 
/* ==========================================================
   DASHBOARD HERO
========================================================== */

.hero-banner {
  position: relative;
  overflow: hidden;

  min-height: 205px;

  padding: 34px 36px;

  margin-bottom: 26px;

  border-radius: 22px;

  border: 1px solid rgba(239,41,75,0.18);

  background:
    radial-gradient(
      circle at 88% 15%,
      rgba(239,41,75,0.20),
      transparent 28%
    ),
    radial-gradient(
      circle at 65% 110%,
      rgba(179,18,45,0.10),
      transparent 35%
    ),
    linear-gradient(
      135deg,
      #171014 0%,
      #101012 45%,
      #0b0b0e 100%
    );

  box-shadow:
    0 25px 70px rgba(0,0,0,0.32),
    inset 0 1px rgba(255,255,255,0.045);
}

.hero-banner::before {
  content: "";

  position: absolute;

  width: 280px;
  height: 280px;

  right: -110px;
  top: -150px;

  border-radius: 50%;

  border: 1px solid rgba(239,41,75,0.16);

  box-shadow:
    0 0 0 35px rgba(239,41,75,0.025),
    0 0 0 70px rgba(239,41,75,0.018);
}

.hero-banner::after {
  content: "";

  position: absolute;

  left: 0;
  bottom: 0;

  width: 100%;
  height: 2px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--red),
      transparent
    );

  opacity: .55;
}

.hero-banner > * {
  position: relative;
  z-index: 2;
}

.hero-banner h2 {
  margin: 8px 0 10px;

  font-family: "Rajdhani", sans-serif;

  font-size: 34px;
  font-weight: 700;

  letter-spacing: .4px;
}

.hero-banner p {
  max-width: 650px;

  margin: 0;

  color: #85858e;

  font-size: 12px;

  line-height: 1.8;
}


/* ==========================================================
   OVERVIEW STAT CARDS
========================================================== */

.overview-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 17px;

  margin-bottom: 28px;
}

.overview-card {
  position: relative;

  min-height: 145px;

  padding: 22px;

  overflow: hidden;

  border-radius: 18px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.045),
      rgba(255,255,255,0.012)
    ),
    #101014;

  box-shadow:
    var(--shadow-card);

  transition: var(--transition);
}

.overview-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 22px;
  right: 22px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(255,255,255,0.12),
      transparent
    );
}

.overview-card::after {
  content: "";

  position: absolute;

  width: 100px;
  height: 100px;

  right: -45px;
  bottom: -45px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,0.14),
      transparent 65%
    );
}

.overview-card:hover {
  transform: translateY(-4px);

  border-color:
    rgba(239,41,75,0.25);

  box-shadow:
    var(--shadow-hover),
    0 0 35px rgba(179,18,45,0.055);
}

.overview-label {
  position: relative;
  z-index: 2;

  color: #777780;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: 1.8px;
}

.overview-value {
  position: relative;
  z-index: 2;

  display: block;

  margin-top: 12px;

  font-family: "Rajdhani", sans-serif;

  font-size: 38px;
  font-weight: 700;

  line-height: 1;

  background:
    linear-gradient(
      180deg,
      #fff,
      #aaaab0
    );

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
}


/* ==========================================================
   ACADEMIC YEAR GRID
========================================================== */

.year-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(245px, 1fr));

  gap: 18px;
}

.year-card {
  position: relative;

  min-height: 185px;

  padding: 25px;

  overflow: hidden;

  text-align: left;

  border-radius: 19px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      #151519,
      #0d0d10
    );

  color: var(--text);

  box-shadow:
    0 18px 45px rgba(0,0,0,0.25);

  transition: var(--transition);
}

.year-card::before {
  content: "";

  position: absolute;

  left: 0;
  top: 0;
  bottom: 0;

  width: 3px;

  background:
    linear-gradient(
      to bottom,
      var(--red-bright),
      var(--red-dark),
      transparent
    );

  opacity: .75;
}

.year-card::after {
  content: "";

  position: absolute;

  width: 180px;
  height: 180px;

  right: -80px;
  bottom: -90px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(239,41,75,0.17),
      transparent 65%
    );

  transition: .35s ease;
}

.year-card:hover {
  transform:
    translateY(-6px)
    scale(1.01);

  border-color:
    rgba(239,41,75,0.32);

  background:
    linear-gradient(
      145deg,
      #1a161a,
      #101012
    );

  box-shadow:
    0 28px 70px rgba(0,0,0,0.4),
    0 0 35px rgba(179,18,45,0.07);
}

.year-card:hover::after {
  transform: scale(1.3);

  background:
    radial-gradient(
      circle,
      rgba(239,41,75,0.22),
      transparent 65%
    );
}

.year-number {
  position: relative;
  z-index: 2;

  font-family: "Rajdhani", sans-serif;

  font-size: 48px;
  font-weight: 700;

  letter-spacing: 1px;

  line-height: 1;

  background:
    linear-gradient(
      180deg,
      #ffffff,
      #a7a7ae
    );

  -webkit-background-clip: text;
  background-clip: text;

  -webkit-text-fill-color: transparent;
}

.year-meta {
  position: relative;
  z-index: 2;

  margin-top: 15px;

  color: #777780;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: .4px;
}

.year-arrow {
  position: absolute;

  right: 23px;
  top: 22px;

  width: 34px;
  height: 34px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #ef5b73;

  background:
    rgba(179,18,45,0.10);

  border:
    1px solid rgba(239,41,75,0.15);

  font-size: 15px;

  transition: .25s ease;
}

.year-card:hover .year-arrow {
  transform: translateX(4px);

  background:
    rgba(239,41,75,0.16);

  color: #fff;
}


/* ==========================================================
   ADD YEAR CARD
========================================================== */

.add-year-card {
  position: relative;

  min-height: 185px;

  border-radius: 19px;

  border: 1px dashed rgba(239,41,75,0.30);

  background:
    linear-gradient(
      145deg,
      rgba(179,18,45,0.055),
      rgba(179,18,45,0.015)
    );

  color: #b97884;

  display: flex;
  align-items: center;
  justify-content: center;

  transition: var(--transition);

  overflow: hidden;
}

.add-year-card::before {
  content: "+";

  position: absolute;

  width: 90px;
  height: 90px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  border: 1px solid rgba(239,41,75,0.09);

  color: rgba(239,41,75,0.08);

  font-size: 75px;
  font-weight: 200;

  right: -25px;
  bottom: -35px;
}

.add-year-card:hover {
  transform: translateY(-5px);

  color: #fff;

  border-color:
    var(--red-bright);

  background:
    linear-gradient(
      145deg,
      rgba(179,18,45,0.13),
      rgba(179,18,45,0.035)
    );

  box-shadow:
    0 25px 55px rgba(179,18,45,0.10);
}


/* ==========================================================
   CONTEXT BANNER
========================================================== */

.context-banner {
  position: relative;

  margin-bottom: 27px;

  padding: 19px 22px;

  border-radius: 16px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      100deg,
      rgba(255,255,255,0.035),
      rgba(255,255,255,0.012)
    );

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  box-shadow:
    0 12px 35px rgba(0,0,0,0.18);
}

.context-banner::before {
  content: "";

  width: 3px;

  position: absolute;

  left: 0;
  top: 14px;
  bottom: 14px;

  border-radius: 0 4px 4px 0;

  background:
    linear-gradient(
      to bottom,
      var(--red-bright),
      transparent
    );
}

.context-banner strong {
  display: block;

  margin-top: 5px;

  font-family: "Rajdhani", sans-serif;

  font-size: 17px;
}

.context-label {
  color: #65656e;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 2px;
}

.context-status {
  color: var(--green);

  font-size: 9px;
  font-weight: 700;

  display: flex;
  align-items: center;

  gap: 7px;

  padding: 7px 10px;

  border-radius: 20px;

  background:
    rgba(67,200,121,0.055);

  border:
    1px solid rgba(67,200,121,0.12);
}

.status-dot {
  width: 7px;
  height: 7px;

  border-radius: 50%;

  background: var(--green);

  box-shadow:
    0 0 12px rgba(67,200,121,0.55);
}


/* ==========================================================
   TERM GRID
========================================================== */

.term-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 19px;
}

.term-card {
  position: relative;

  min-height: 235px;

  padding: 26px;

  overflow: hidden;

  text-align: left;

  border-radius: 20px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      #151519,
      #0d0d10
    );

  color: var(--text);

  box-shadow:
    0 18px 50px rgba(0,0,0,0.26);

  transition: var(--transition);
}

.term-card::before {
  content: "";

  position: absolute;

  left: 0;
  right: 0;
  top: 0;

  height: 2px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--red),
      transparent
    );

  opacity: .45;
}

.term-card::after {
  content: "";

  position: absolute;

  width: 170px;
  height: 170px;

  right: -75px;
  bottom: -80px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,0.13),
      transparent 65%
    );

  transition: .35s ease;
}

.term-card:hover {
  transform: translateY(-7px);

  border-color:
    rgba(239,41,75,0.30);

  box-shadow:
    0 30px 75px rgba(0,0,0,0.42),
    0 0 35px rgba(179,18,45,0.06);
}

.term-card:hover::after {
  transform: scale(1.35);
}

.term-number {
  position: relative;
  z-index: 2;

  display: inline-flex;

  padding: 5px 9px;

  border-radius: 6px;

  background:
    rgba(179,18,45,0.09);

  border:
    1px solid rgba(239,41,75,0.13);

  color: var(--red-bright);

  font-family: "Rajdhani", sans-serif;

  font-size: 10px;
  font-weight: 700;

  letter-spacing: 2px;
}

.term-card h3 {
  position: relative;
  z-index: 2;

  margin: 15px 0 8px;

  font-family: "Rajdhani", sans-serif;

  font-size: 30px;
  font-weight: 700;
}

.term-card p {
  position: relative;
  z-index: 2;

  margin: 0;

  max-width: 270px;

  color: #73737c;

  font-size: 10px;

  line-height: 1.75;
}

.term-arrow {
  position: absolute;

  right: 24px;
  bottom: 22px;

  width: 35px;
  height: 35px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--red-bright);

  background:
    rgba(179,18,45,0.08);

  border:
    1px solid rgba(239,41,75,0.14);

  transition: .25s ease;
}

.term-card:hover .term-arrow {
  transform: translateX(5px);

  color: #fff;

  background:
    rgba(239,41,75,0.15);
}


/* ==========================================================
   TERM SECTION CARDS
========================================================== */

.section-card-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 19px;
}

.section-card {
  position: relative;

  min-height: 215px;

  padding: 25px;

  overflow: hidden;

  text-align: left;

  border-radius: 19px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      #151519,
      #0e0e11
    );

  color: var(--text);

  box-shadow:
    var(--shadow-card);

  transition: var(--transition);
}

.section-card::after {
  content: "";

  position: absolute;

  width: 130px;
  height: 130px;

  right: -60px;
  bottom: -65px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,0.13),
      transparent 65%
    );

  transition: .35s ease;
}

.section-card:hover {
  transform: translateY(-6px);

  border-color:
    rgba(239,41,75,0.28);

  box-shadow:
    var(--shadow-hover);
}

.section-card:hover::after {
  transform: scale(1.4);
}

.section-card-icon {
  position: relative;
  z-index: 2;

  width: 48px;
  height: 48px;

  display: flex;
  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background:
    linear-gradient(
      145deg,
      rgba(239,41,75,0.16),
      rgba(179,18,45,0.045)
    );

  border:
    1px solid rgba(239,41,75,0.22);

  color: var(--red-bright);

  font-weight: 800;

  font-size: 17px;

  box-shadow:
    0 8px 25px rgba(179,18,45,0.08);
}

.section-card h3 {
  position: relative;
  z-index: 2;

  margin: 19px 0 8px;

  font-family: "Rajdhani", sans-serif;

  font-size: 25px;
  font-weight: 700;
}

.section-card p {
  position: relative;
  z-index: 2;

  margin: 0;

  color: #73737c;

  font-size: 10px;

  line-height: 1.75;
}


/* ==========================================================
   SECTION HEADERS
========================================================== */

.content-section {
  margin-top: 30px;
}

.section-header {
  margin-bottom: 15px;

  display: flex;
  align-items: flex-end;
  justify-content: space-between;

  gap: 15px;
}

.section-header h2 {
  margin: 5px 0 0;

  font-family: "Rajdhani", sans-serif;

  font-size: 25px;
  font-weight: 700;
}

.record-count {
  padding: 6px 9px;

  border-radius: 7px;

  background:
    rgba(255,255,255,0.035);

  border: 1px solid var(--border);

  color: #6f6f78;

  font-size: 9px;
  font-weight: 700;
}


/* ==========================================================
   BACK BUTTON
========================================================== */

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 7px;

  padding: 7px 10px;

  border-radius: 8px;

  transition: .2s ease;
}

.back-button:hover {
  background:
    rgba(179,18,45,0.07);

  color: var(--red-bright);

  transform: translateX(-2px);
}


/* ==========================================================
   GLOBAL CARD POLISH
========================================================== */

.attendance-list,
.payment-history,
.gas-history {
  box-shadow:
    0 18px 50px rgba(0,0,0,0.24);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.025),
      rgba(255,255,255,0.008)
    ),
    #101014;
}

.attendance-row,
.payment-history-row,
.gas-row {
  transition: background .2s ease;
}

.attendance-row:hover,
.payment-history-row:hover,
.gas-row:hover {
  background:
    rgba(255,255,255,0.025);
}


/* ==========================================================
   RESPONSIVE — DASHBOARD
========================================================== */

@media (max-width: 1100px) {
  .overview-grid {
    grid-template-columns:
      repeat(3, minmax(0,1fr));
  }

  .term-grid,
  .section-card-grid {
    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }
}

@media (max-width: 700px) {
  .hero-banner {
    min-height: 180px;
    padding: 27px 23px;
  }

  .hero-banner h2 {
    font-size: 29px;
  }

  .overview-grid {
    grid-template-columns: 1fr;
  }

  .overview-card {
    min-height: 125px;
  }

  .year-grid {
    grid-template-columns: 1fr;
  }

  .term-grid,
  .section-card-grid {
    grid-template-columns: 1fr;
  }

  .term-card,
  .section-card {
    min-height: 195px;
  }
}

 
/* ==========================================================
   ATTENDANCE TOOLBAR
========================================================== */

.attendance-toolbar {
  position: relative;

  padding: 19px;

  margin-bottom: 18px;

  border-radius: 17px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.035),
      rgba(255,255,255,0.01)
    ),
    #101014;

  box-shadow:
    0 15px 40px rgba(0,0,0,0.22);

  display: flex;
  align-items: flex-end;
  gap: 15px;
}

.toolbar-field {
  flex: 1;
}

.toolbar-field.date {
  max-width: 190px;
}

.attendance-stats {
  display: flex;
  gap: 8px;
}

.attendance-stat {
  min-width: 72px;

  padding: 9px 12px;

  border-radius: 9px;

  background:
    rgba(255,255,255,0.035);

  border: 1px solid var(--border);

  font-size: 9px;
  font-weight: 800;

  text-align: center;

  transition: .2s ease;
}

.attendance-stat:hover {
  transform: translateY(-1px);

  background:
    rgba(255,255,255,0.055);
}

.attendance-stat.present {
  color: var(--green);

  border-color:
    rgba(67,200,121,0.16);

  background:
    rgba(67,200,121,0.045);
}

.attendance-stat.absent {
  color: #ff7185;

  border-color:
    rgba(239,41,75,0.16);

  background:
    rgba(239,41,75,0.045);
}


/* ==========================================================
   ATTENDANCE LIST
========================================================== */

.attendance-list {
  overflow: hidden;

  border-radius: 18px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,0.025),
      rgba(255,255,255,0.008)
    ),
    #101014;

  box-shadow:
    0 20px 55px rgba(0,0,0,0.25);
}

.attendance-row {
  position: relative;

  min-height: 72px;

  padding: 14px 18px;

  display: grid;

  grid-template-columns:
    minmax(200px, 1fr)
    240px
    minmax(180px, .8fr);

  gap: 18px;

  align-items: center;

  border-bottom:
    1px solid rgba(255,255,255,0.045);

  transition: .2s ease;
}

.attendance-row:last-child {
  border-bottom: 0;
}

.attendance-row:hover {
  background:
    linear-gradient(
      90deg,
      rgba(179,18,45,0.045),
      rgba(255,255,255,0.015)
    );
}

.attendance-row:hover::before {
  content: "";

  position: absolute;

  left: 0;
  top: 13px;
  bottom: 13px;

  width: 2px;

  border-radius: 3px;

  background:
    var(--red-bright);
}

.employee-cell {
  display: flex;
  align-items: center;
  gap: 12px;

  min-width: 0;
}

.employee-cell .employee-avatar {
  box-shadow:
    0 5px 20px rgba(0,0,0,.35);
}

.employee-name {
  font-size: 12px;
  font-weight: 800;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.employee-phone {
  margin-top: 4px;

  color: #686870;

  font-size: 9px;
}

.status-buttons {
  display: flex;
  gap: 7px;
}

.status-button {
  flex: 1;

  min-height: 37px;

  border: 1px solid var(--border);

  border-radius: 9px;

  background:
    #151519;

  color: #66666f;

  font-size: 9px;
  font-weight: 800;

  transition: .2s ease;
}

.status-button:hover {
  color: #fff;

  border-color:
    rgba(255,255,255,0.14);

  background:
    #1c1c21;
}

.status-button.present.active {
  background:
    linear-gradient(
      145deg,
      rgba(67,200,121,0.14),
      rgba(67,200,121,0.045)
    );

  border-color:
    rgba(67,200,121,0.35);

  color: var(--green);

  box-shadow:
    0 5px 18px rgba(67,200,121,0.07);
}

.status-button.absent.active {
  background:
    linear-gradient(
      145deg,
      rgba(239,41,75,0.14),
      rgba(239,41,75,0.045)
    );

  border-color:
    rgba(239,41,75,0.35);

  color: #ff7185;

  box-shadow:
    0 5px 18px rgba(239,41,75,0.07);
}


/* ==========================================================
   FORM INPUTS
========================================================== */

.field-label {
  display: block;

  margin-bottom: 7px;

  color: #aaaab2;

  font-size: 9px;
  font-weight: 800;

  letter-spacing: .5px;
}

.text-input,
.message-input,
select {
  width: 100%;

  border: 1px solid var(--border);

  border-radius: 10px;

  outline: none;

  background:
    linear-gradient(
      145deg,
      #101014,
      #0b0b0e
    );

  color: var(--text);

  transition: .2s ease;
}

.text-input {
  height: 45px;

  padding: 0 13px;
}

.message-input {
  padding: 12px 13px;

  resize: vertical;

  line-height: 1.6;
}

.text-input:hover,
.message-input:hover,
select:hover {
  border-color:
    rgba(255,255,255,0.12);
}

.text-input:focus,
.message-input:focus,
select:focus {
  border-color:
    rgba(239,41,75,0.55);

  box-shadow:
    0 0 0 3px rgba(179,18,45,0.08),
    0 8px 25px rgba(0,0,0,0.2);
}

.text-input::placeholder,
.message-input::placeholder {
  color: #4f4f57;
}

.field-help {
  display: block;

  margin-top: 6px;

  color: #56565e;

  font-size: 9px;
}

.form-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 17px;
}

.form-field.full {
  grid-column: 1 / -1;
}


/* ==========================================================
   MONEY INPUT
========================================================== */

.money-input {
  height: 45px;

  display: flex;
  align-items: center;

  overflow: hidden;

  border: 1px solid var(--border);

  border-radius: 10px;

  background:
    linear-gradient(
      145deg,
      #101014,
      #0b0b0e
    );

  transition: .2s ease;
}

.money-input:focus-within {
  border-color:
    rgba(239,41,75,0.55);

  box-shadow:
    0 0 0 3px rgba(179,18,45,0.08);
}

.money-input span {
  height: 100%;

  padding: 0 13px;

  display: flex;
  align-items: center;

  border-right:
    1px solid var(--border);

  color: #777780;

  font-size: 9px;
  font-weight: 800;
}

.money-input input {
  min-width: 0;

  width: 100%;
  height: 100%;

  padding: 0 13px;

  border: 0;
  outline: 0;

  background: transparent;

  color: #fff;
}

.money-input.large {
  height: 58px;
}

.money-input.large span {
  font-size: 11px;
}

.money-input.large input {
  font-size: 19px;
  font-weight: 800;
}


/* ==========================================================
   EMPLOYEE PAYMENT CARDS
========================================================== */

.employee-grid {
  display: grid;

  grid-template-columns:
    repeat(auto-fill, minmax(255px, 1fr));

  gap: 18px;
}

.employee-payment-card {
  position: relative;

  min-height: 205px;

  padding: 22px;

  overflow: hidden;

  text-align: left;

  color: var(--text);

  border: 1px solid var(--border);

  border-radius: 19px;

  background:
    linear-gradient(
      145deg,
      #151519,
      #0e0e11
    );

  box-shadow:
    0 17px 45px rgba(0,0,0,0.24);

  transition: var(--transition);
}

.employee-payment-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 20px;
  right: 20px;

  height: 1px;

  background:
    linear-gradient(
      90deg,
      transparent,
      rgba(239,41,75,.35),
      transparent
    );
}

.employee-payment-card::after {
  content: "";

  position: absolute;

  width: 150px;
  height: 150px;

  right: -80px;
  bottom: -80px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,.13),
      transparent 65%
    );

  transition: .35s ease;
}

.employee-payment-card:hover {
  transform:
    translateY(-6px);

  border-color:
    rgba(239,41,75,.28);

  box-shadow:
    0 28px 65px rgba(0,0,0,.4),
    0 0 30px rgba(179,18,45,.055);
}

.employee-payment-card:hover::after {
  transform: scale(1.35);
}

.employee-card-top {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: space-between;
}

.employee-card-arrow {
  width: 32px;
  height: 32px;

  border-radius: 50%;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #e9566e;

  background:
    rgba(179,18,45,.08);

  border:
    1px solid rgba(239,41,75,.13);

  transition: .2s ease;
}

.employee-payment-card:hover
.employee-card-arrow {
  transform: translateX(4px);

  color: #fff;

  background:
    rgba(239,41,75,.16);
}

.employee-card-name {
  position: relative;
  z-index: 2;

  margin-top: 17px;

  font-family: "Rajdhani", sans-serif;

  font-size: 22px;
  font-weight: 700;
}

.employee-card-phone {
  position: relative;
  z-index: 2;

  margin-top: 4px;

  color: #6c6c75;

  font-size: 9px;
}

.employee-card-footer {
  position: relative;
  z-index: 2;

  margin-top: 20px;

  padding-top: 13px;

  border-top:
    1px solid rgba(255,255,255,.045);

  display: flex;

  justify-content: space-between;

  color: #65656d;

  font-size: 9px;
}


/* ==========================================================
   PAYMENT STAT CARDS
========================================================== */

.payment-stat-grid {
  display: grid;

  grid-template-columns:
    repeat(4, minmax(0,1fr));

  gap: 16px;

  margin-bottom: 28px;
}

.payment-stat-card {
  position: relative;

  min-height: 145px;

  padding: 21px;

  overflow: hidden;

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.04),
      rgba(255,255,255,.01)
    ),
    #101014;

  border: 1px solid var(--border);

  border-radius: 18px;

  box-shadow:
    0 16px 45px rgba(0,0,0,.23);

  transition: var(--transition);
}

.payment-stat-card::after {
  content: "";

  position: absolute;

  width: 110px;
  height: 110px;

  right: -55px;
  bottom: -55px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,.13),
      transparent 65%
    );
}

.payment-stat-card:hover {
  transform: translateY(-4px);

  border-color:
    rgba(239,41,75,.22);

  box-shadow:
    0 25px 60px rgba(0,0,0,.35);
}

.payment-stat-card.highlight {
  border-color:
    rgba(239,41,75,.30);

  background:
    radial-gradient(
      circle at 90% 10%,
      rgba(239,41,75,.13),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      rgba(179,18,45,.09),
      #101014
    );
}

.stat-label {
  position: relative;
  z-index: 2;

  color: #74747d;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.7px;
}

.payment-stat-card strong {
  position: relative;
  z-index: 2;

  display: block;

  margin-top: 11px;

  font-family: "Rajdhani", sans-serif;

  font-size: 31px;
  font-weight: 700;

  line-height: 1;
}

.payment-stat-card small {
  position: relative;
  z-index: 2;

  display: block;

  margin-top: 7px;

  color: #5e5e66;

  font-size: 9px;
}


/* ==========================================================
   EMPLOYEE PROFILE
========================================================== */

.employee-profile-heading {
  position: relative;

  display: flex;
  align-items: center;

  gap: 18px;

  margin-top: 18px;

  padding: 20px;

  border-radius: 17px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.035),
      rgba(255,255,255,.01)
    );

  box-shadow:
    0 15px 40px rgba(0,0,0,.2);
}

.employee-profile-heading::before {
  content: "";

  position: absolute;

  left: 0;
  top: 16px;
  bottom: 16px;

  width: 3px;

  border-radius: 0 4px 4px 0;

  background:
    linear-gradient(
      to bottom,
      var(--red-bright),
      transparent
    );
}


/* ==========================================================
   PAYMENT HISTORY
========================================================== */

.payment-history,
.gas-history {
  overflow: hidden;

  border-radius: 18px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.025),
      rgba(255,255,255,.008)
    ),
    #101014;

  box-shadow:
    0 18px 50px rgba(0,0,0,.24);
}

.payment-history-row,
.gas-row {
  min-height: 67px;

  padding: 15px 18px;

  display: flex;
  align-items: center;

  gap: 13px;

  border-bottom:
    1px solid rgba(255,255,255,.045);

  transition: .2s ease;
}

.payment-history-row:last-child,
.gas-row:last-child {
  border-bottom: 0;
}

.payment-history-row:hover,
.gas-row:hover {
  background:
    rgba(179,18,45,.035);
}

.payment-method-icon,
.gas-icon {
  width: 40px;
  height: 40px;

  flex-shrink: 0;

  border-radius: 11px;

  background:
    linear-gradient(
      145deg,
      rgba(239,41,75,.14),
      rgba(179,18,45,.035)
    );

  border:
    1px solid rgba(239,41,75,.18);

  display: flex;
  align-items: center;
  justify-content: center;

  color: var(--red-bright);

  font-size: 12px;
  font-weight: 800;
}

.payment-history-main,
.gas-details {
  min-width: 0;
  flex: 1;
}

.payment-history-main strong,
.gas-details strong {
  display: block;

  font-size: 12px;
  font-weight: 800;
}

.payment-history-main span,
.gas-details span {
  display: block;

  margin-top: 4px;

  color: #64646c;

  font-size: 9px;
}

.payment-history-reference,
.gas-term-label {
  color: #66666e;

  font-size: 9px;
}

.payment-status-badge {
  padding: 6px 10px;

  border-radius: 7px;

  font-size: 8px;
  font-weight: 800;

  text-transform: uppercase;
  letter-spacing: .8px;
}

.payment-status-badge.success {
  background:
    rgba(67,200,121,.08);

  border:
    1px solid rgba(67,200,121,.14);

  color: var(--green);
}


/* ==========================================================
   GAS PAYMENT CARD
========================================================== */

.gas-entry-card {
  position: relative;

  padding: 27px;

  overflow: hidden;

  border-radius: 20px;

  border: 1px solid var(--border);

  background:
    radial-gradient(
      circle at 100% 0%,
      rgba(239,41,75,.13),
      transparent 30%
    ),
    linear-gradient(
      145deg,
      #151519,
      #0d0d10
    );

  box-shadow:
    0 22px 60px rgba(0,0,0,.28);
}

.gas-entry-card::after {
  content: "";

  position: absolute;

  width: 180px;
  height: 180px;

  right: -80px;
  bottom: -100px;

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,.13),
      transparent 65%
    );
}

.gas-entry-content {
  position: relative;
  z-index: 2;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 35px;
}

.gas-entry-card h2 {
  margin: 6px 0 9px;

  font-family: "Rajdhani", sans-serif;

  font-size: 28px;
  font-weight: 700;
}

.gas-entry-card p {
  margin: 0;

  max-width: 560px;

  color: #73737c;

  font-size: 10px;

  line-height: 1.8;
}

.gas-form {
  width: 320px;

  flex-shrink: 0;
}

.gas-form .primary-button {
  margin-top: 10px;

  width: 100%;
}


/* ==========================================================
   RESPONSIVE
========================================================== */

@media (max-width: 1100px) {
  .payment-stat-grid {
    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }

  .attendance-row {
    grid-template-columns:
      1fr 210px;
  }

  .attendance-row > :last-child {
    grid-column: 1 / -1;
  }
}

@media (max-width: 750px) {
  .attendance-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .toolbar-field.date {
    max-width: none;
  }

  .attendance-stats {
    width: 100%;
  }

  .attendance-stat {
    flex: 1;
  }

  .attendance-row {
    grid-template-columns: 1fr;
    gap: 11px;
  }

  .attendance-row > :last-child {
    grid-column: auto;
  }

  .payment-stat-grid {
    grid-template-columns: 1fr 1fr;
  }

  .gas-entry-content {
    align-items: stretch;
    flex-direction: column;
  }

  .gas-form {
    width: 100%;
  }
}

@media (max-width: 520px) {
  .payment-stat-grid {
    grid-template-columns: 1fr;
  }

  .employee-grid {
    grid-template-columns: 1fr;
  }

  .employee-profile-heading {
    align-items: flex-start;
  }

  .payment-history-row,
  .gas-row {
    align-items: flex-start;
    flex-wrap: wrap;
  }

  .payment-history-reference,
  .gas-term-label {
    width: 100%;
    padding-left: 53px;
  }

  .payment-status-badge {
    margin-left: auto;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-field.full {
    grid-column: auto;
  }
}
 
/* ==========================================================
   MODAL OVERLAY
========================================================== */

.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(10px);
  overflow-y: auto;
  box-sizing: border-box;
}

.modal-card {
  width: min(680px, 100%);
  max-height: calc(100vh - 48px);
  overflow-y: auto;
  background: #111116;
  border: 1px solid rgba(255, 255, 255, 0.09);
  border-radius: 22px;
  padding: 30px;
  box-sizing: border-box;
  box-shadow:
    0 30px 80px rgba(0, 0, 0, 0.65),
    0 0 40px rgba(190, 20, 55, 0.08);
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 28px;
}

.modal-header h2 {
  margin: 4px 0 8px;
  font-size: 28px;
  font-weight: 800;
}

.modal-header p:not(.eyebrow) {
  margin: 0;
  max-width: 540px;
  color: #8f8f9c;
  line-height: 1.6;
}

.modal-close {
  width: 40px;
  height: 40px;
  flex: 0 0 40px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  background: #19191f;
  color: #aaa;
  font-size: 24px;
  cursor: pointer;
}

.modal-close:hover {
  color: #fff;
  border-color: rgba(220, 35, 70, 0.5);
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 28px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

/* ==========================================================
   PAYMENT METHOD SELECTOR
========================================================== */

.payment-method-grid {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0,1fr));

  gap: 11px;

  margin-bottom: 22px;
}

.payment-method {
  min-height: 94px;

  padding: 14px 10px;

  border-radius: 13px;

  border: 1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      #16161a,
      #101013
    );

  color: #6d6d76;

  display: flex;

  flex-direction: column;

  align-items: center;
  justify-content: center;

  gap: 9px;

  transition: .22s ease;
}

.payment-method:hover {
  color: #fff;

  transform:
    translateY(-2px);

  border-color:
    rgba(255,255,255,.13);
}

.payment-method.active {
  color: #fff;

  border-color:
    rgba(239,41,75,.42);

  background:
    linear-gradient(
      145deg,
      rgba(179,18,45,.17),
      rgba(179,18,45,.045)
    );

  box-shadow:
    0 12px 30px rgba(179,18,45,.09);
}

.payment-method-icon-large {
  width: 36px;
  height: 36px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background:
    rgba(255,255,255,.035);

  border:
    1px solid rgba(255,255,255,.06);

  font-size: 14px;
}

.payment-method.active
.payment-method-icon-large {
  background:
    rgba(239,41,75,.12);

  border-color:
    rgba(239,41,75,.2);

  color: var(--red-bright);
}

.payment-method-name {
  font-size: 9px;

  font-weight: 800;

  letter-spacing: .3px;
}


/* ==========================================================
   TRANSACTION PREVIEW
========================================================== */

.transaction-preview {
  position: relative;

  margin-top: 18px;

  padding: 18px;

  border-radius: 14px;

  border:
    1px solid rgba(239,41,75,.18);

  background:
    linear-gradient(
      145deg,
      rgba(179,18,45,.08),
      rgba(255,255,255,.015)
    );
}

.transaction-preview::before {
  content: "TRANSACTION PREVIEW";

  display: block;

  margin-bottom: 15px;

  color: var(--red-bright);

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 2px;
}

.transaction-preview-grid {
  display: grid;

  grid-template-columns:
    1fr 1fr;

  gap: 12px;
}

.transaction-detail {
  padding: 10px 11px;

  border-radius: 9px;

  background:
    rgba(0,0,0,.18);

  border:
    1px solid rgba(255,255,255,.035);
}

.transaction-detail-label {
  color: #5f5f67;

  font-size: 8px;

  font-weight: 700;

  text-transform: uppercase;

  letter-spacing: .8px;
}

.transaction-detail-value {
  margin-top: 5px;

  color: #ededee;

  font-size: 10px;

  font-weight: 800;

  word-break: break-word;
}

.transaction-detail-value.amount {
  color: var(--green);

  font-family: "Rajdhani", sans-serif;

  font-size: 19px;
}

.match-status {
  display: flex;

  align-items: center;

  gap: 7px;

  margin-top: 14px;

  padding: 9px 11px;

  border-radius: 9px;

  font-size: 9px;

  font-weight: 800;
}

.match-status.success {
  color: var(--green);

  background:
    rgba(67,200,121,.055);

  border:
    1px solid rgba(67,200,121,.12);
}

.match-status.warning {
  color: var(--yellow);

  background:
    rgba(227,179,65,.055);

  border:
    1px solid rgba(227,179,65,.12);
}


/* ==========================================================
   ALERTS / TOASTS
========================================================== */

.alert {
  position: relative;

  padding: 13px 15px;

  margin-bottom: 18px;

  border-radius: 11px;

  border: 1px solid var(--border);

  font-size: 10px;

  line-height: 1.6;

  animation:
    alertEnter .25s ease;
}

@keyframes alertEnter {
  from {
    opacity: 0;
    transform:
      translateY(-5px);
  }

  to {
    opacity: 1;
    transform:
      translateY(0);
  }
}

.alert-error {
  color: #ff8a9b;

  background:
    rgba(179,18,45,.08);

  border-color:
    rgba(239,41,75,.20);
}

.alert-success {
  color: #78dda0;

  background:
    rgba(67,200,121,.055);

  border-color:
    rgba(67,200,121,.15);
}

.alert-info {
  color: #a8a8b0;

  background:
    rgba(255,255,255,.035);
}


/* ==========================================================
   EMPTY STATES
========================================================== */

.empty-state {
  min-height: 220px;

  padding: 35px 25px;

  border-radius: 18px;

  border:
    1px dashed rgba(255,255,255,.09);

  background:
    linear-gradient(
      145deg,
      rgba(255,255,255,.018),
      rgba(255,255,255,.006)
    );

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  text-align: center;
}

.empty-icon {
  width: 55px;
  height: 55px;

  margin-bottom: 16px;

  border-radius: 15px;

  display: flex;
  align-items: center;
  justify-content: center;

  color: #777780;

  background:
    rgba(255,255,255,.035);

  border:
    1px solid rgba(255,255,255,.07);

  font-size: 18px;
}

.empty-state h3 {
  margin: 0 0 7px;

  font-family: "Rajdhani", sans-serif;

  font-size: 21px;
}

.empty-state p {
  max-width: 420px;

  margin: 0;

  color: #62626a;

  font-size: 10px;

  line-height: 1.7;
}


/* ==========================================================
   LOADING STATE
========================================================== */

.loading-state {
  min-height: 220px;

  display: flex;

  align-items: center;
  justify-content: center;

  flex-direction: column;

  gap: 13px;

  color: #66666f;

  font-size: 10px;
}

.loading-spinner {
  width: 34px;
  height: 34px;

  border-radius: 50%;

  border:
    2px solid rgba(255,255,255,.06);

  border-top-color:
    var(--red-bright);

  animation:
    spin .8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}



/* ==========================================================
   LOGIN SCREEN — PROFESSIONAL PATHWHEELERS DESIGN
========================================================== */

.auth-page {
  position: relative;

  min-height: 100vh;
  width: 100%;

  display: flex;
  align-items: center;

  padding: 40px 6vw;

  box-sizing: border-box;

  overflow: hidden;

  background:
    radial-gradient(
      circle at 78% 50%,
      rgba(179,18,45,.09),
      transparent 32%
    ),
    radial-gradient(
      circle at 10% 90%,
      rgba(179,18,45,.045),
      transparent 30%
    ),
    linear-gradient(
      145deg,
      #050506,
      #09090c
    );
}


/* ==========================================================
   SUBTLE BACKGROUND GRID
========================================================== */

.auth-page::before {
  content: "";

  position: absolute;

  inset: 0;

  pointer-events: none;

  background-image:
    linear-gradient(
      rgba(255,255,255,.018) 1px,
      transparent 1px
    ),
    linear-gradient(
      90deg,
      rgba(255,255,255,.018) 1px,
      transparent 1px
    );

  background-size: 50px 50px;

  opacity: .35;

  mask-image:
    linear-gradient(
      90deg,
      black,
      transparent 88%
    );
}


/* ==========================================================
   RED AMBIENT LIGHT
========================================================== */

.auth-page::after {
  content: "";

  position: absolute;

  width: 700px;
  height: 700px;

  right: -300px;
  top: 50%;

  transform:
    translateY(-50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(179,18,45,.09),
      rgba(179,18,45,.025) 40%,
      transparent 72%
    );

  pointer-events: none;
}


/* ==========================================================
   AUTH CARD
========================================================== */

.auth-card {
  position: relative;

  z-index: 20;

  width: 430px;

  min-height: 590px;

  padding:
    46px
    44px
    38px;

  box-sizing: border-box;

  border-radius: 20px;

  border:
    1px solid rgba(255,255,255,.075);

  background:
    linear-gradient(
      145deg,
      rgba(22,22,27,.97),
      rgba(10,10,13,.98)
    );

  box-shadow:
    0 40px 100px rgba(0,0,0,.62),
    0 0 60px rgba(179,18,45,.045);

  backdrop-filter:
    blur(18px);

  -webkit-backdrop-filter:
    blur(18px);

  overflow: hidden;
}


/* ==========================================================
   CARD RED ACCENT
========================================================== */

.auth-card::before {
  content: "";

  position: absolute;

  top: 0;
  left: 35px;
  right: 35px;

  height: 2px;

  background:
    linear-gradient(
      90deg,
      transparent,
      var(--red-bright),
      transparent
    );

  opacity: .75;
}


/* ==========================================================
   BRAND AREA
========================================================== */

.auth-brand {
  text-align: left;

  margin-bottom: 0;
}


.auth-brand .brand-mark {
  margin: 0 0 18px;

  width: 50px;
  height: 50px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 13px;

  background:
    linear-gradient(
      145deg,
      #ef294b,
      #a90f2c
    );

  color: #fff;

  font-family:
    "Rajdhani",
    sans-serif;

  font-size: 17px;

  font-weight: 800;

  letter-spacing: 1px;

  box-shadow:
    0 10px 30px rgba(179,18,45,.22);
}


.auth-brand h1 {
  margin: 0;

  font-family:
    "Rajdhani",
    sans-serif;

  font-size: 27px;

  line-height: 1;

  letter-spacing: 3px;

  font-weight: 800;

  color: #f4f4f5;
}


.auth-brand p {
  margin: 8px 0 0;

  color: #66666f;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 2px;

  text-transform: uppercase;
}


/* ==========================================================
   AUTH HEADING
========================================================== */

.auth-card h1 {
  margin-top: 48px;

  margin-bottom: 7px;

  font-family:
    "Rajdhani",
    sans-serif;

  font-size: 32px;

  line-height: 1.1;

  font-weight: 700;

  letter-spacing: -.5px;

  color: #f5f5f6;
}


.auth-card h1 + p,
.auth-subtitle {
  margin-top: 0;

  margin-bottom: 28px;

  color: #66666f;

  font-size: 11px;

  line-height: 1.7;
}


/* ==========================================================
   FORM
========================================================== */

.auth-form {
  display: flex;

  flex-direction: column;

  gap: 18px;
}


/* ==========================================================
   FIELD
========================================================== */

.auth-form label {
  display: block;

  margin-bottom: 8px;

  color: #73737c;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 1.8px;

  text-transform: uppercase;
}


/* ==========================================================
   INPUT
========================================================== */

.auth-form input {
  width: 100%;

  height: 50px;

  padding:
    0
    15px;

  box-sizing: border-box;

  border-radius: 10px;

  border:
    1px solid rgba(255,255,255,.08);

  outline: none;

  background:
    #0e0e12;

  color: #f5f5f6;

  font-family:
    "Inter",
    sans-serif;

  font-size: 12px;

  transition:
    .2s ease;
}


.auth-form input::placeholder {
  color: #45454d;
}


.auth-form input:hover {
  border-color:
    rgba(255,255,255,.13);
}


.auth-form input:focus {
  border-color:
    rgba(239,41,75,.55);

  background:
    #111116;

  box-shadow:
    0 0 0 3px
    rgba(179,18,45,.07);
}


/* ==========================================================
   PRIMARY BUTTON
========================================================== */

.auth-form .primary-button,
.auth-primary-button {
  width: 100%;

  height: 52px;

  margin-top: 4px;

  border: none;

  border-radius: 10px;

  background:
    linear-gradient(
      135deg,
      #ef294b,
      #b30f2e
    );

  color: #fff;

  font-size: 9px;

  font-weight: 900;

  letter-spacing: 2px;

  cursor: pointer;

  box-shadow:
    0 12px 30px rgba(179,18,45,.22);

  transition:
    transform .2s ease,
    box-shadow .2s ease,
    filter .2s ease;
}


.auth-form .primary-button:hover,
.auth-primary-button:hover {
  transform:
    translateY(-2px);

  filter:
    brightness(1.08);

  box-shadow:
    0 16px 35px rgba(179,18,45,.30);
}


.auth-form .primary-button:active,
.auth-primary-button:active {
  transform:
    translateY(0);
}


.auth-form .primary-button:disabled,
.auth-primary-button:disabled {
  opacity: .55;

  cursor: not-allowed;

  transform: none;
}


/* ==========================================================
   REGISTER SWITCH
========================================================== */

.auth-switch,
.auth-register {
  margin-top: 25px;

  padding-top: 20px;

  border-top:
    1px solid rgba(255,255,255,.055);

  text-align: center;

  color: #55555e;

  font-size: 9px;
}


.auth-switch button,
.auth-link-button {
  border: none;

  background: transparent;

  color: var(--red-bright);

  font-size: inherit;

  font-weight: 800;

  padding: 0;

  margin-left: 5px;

  cursor: pointer;
}


.auth-switch button:hover,
.auth-link-button:hover {
  color: #ff5470;

  text-decoration: underline;
}


/* ==========================================================
   ERROR
========================================================== */

.auth-error {
  margin-bottom: 18px;

  padding:
    11px
    13px;

  border-radius: 9px;

  border:
    1px solid rgba(239,41,75,.20);

  background:
    rgba(179,18,45,.07);

  color: #ff6b83;

  font-size: 10px;

  line-height: 1.5;
}


/* ==========================================================
   SUCCESS
========================================================== */

.auth-success {
  margin-bottom: 18px;

  padding:
    11px
    13px;

  border-radius: 9px;

  border:
    1px solid rgba(70,190,110,.18);

  background:
    rgba(70,190,110,.06);

  color: #76d995;

  font-size: 10px;

  line-height: 1.5;
}


/* ==========================================================
   HIDE OLD GOOGLE / OTP ELEMENTS
========================================================== */

.google-button,
.auth-divider,
.otp-box {
  display: none;
}


/* ==========================================================
   ORBITING WHEELS
========================================================== */

.wheel-brand-animation {
  position: absolute;

  right: 5%;

  top: 50%;

  width: 540px;
  height: 540px;

  transform:
    translateY(-50%);

  display: flex;

  align-items: center;
  justify-content: center;

  pointer-events: none;

  z-index: 10;
}


.wheel {
  position: absolute;

  width: 92px;
  height: 92px;

  left: 50%;
  top: 50%;

  margin-left: -46px;
  margin-top: -46px;

  box-sizing: border-box;

  border:
    9px solid #d00000;

  border-radius: 50%;

  box-shadow:
    0 0 14px rgba(208,0,0,.40),
    0 0 30px rgba(208,0,0,.15);

  animation:
    pwOrbit 0.5s linear infinite;
}


.wheel-top {
  --start-angle: 0deg;
}


.wheel-right {
  --start-angle: 90deg;
}


.wheel-bottom {
  --start-angle: 180deg;
}


.wheel-left {
  --start-angle: 270deg;
}


/* ==========================================================
   WHEEL INNER DETAIL
========================================================== */

.wheel-inner {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 58px;
  height: 58px;

  transform:
    translate(-50%, -50%);

  animation:
    pwWheelSpin 1s linear infinite;
}


.wheel-inner span {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 4px;
  height: 56px;

  border-radius: 4px;

  background:
    #d00000;

  transform-origin:
    center;
}


.wheel-inner span:nth-child(1) {
  transform:
    translate(-50%, -50%)
    rotate(0deg);
}


.wheel-inner span:nth-child(2) {
  transform:
    translate(-50%, -50%)
    rotate(60deg);
}


.wheel-inner span:nth-child(3) {
  transform:
    translate(-50%, -50%)
    rotate(120deg);
}


/* ==========================================================
   WHEEL HUB
========================================================== */

.wheel::before {
  content: "";

  position: absolute;

  width: 22px;
  height: 22px;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  border:
    4px solid #d00000;

  border-radius: 50%;

  box-sizing: border-box;
}


/* ==========================================================
   ORBIT
========================================================== */

@keyframes pwOrbit {

  0% {
    transform:
      rotate(var(--start-angle))
      translateX(220px)
      rotate(calc(var(--start-angle) * -1));

    opacity: .45;
  }

  25% {
    transform:
      rotate(calc(var(--start-angle) + 90deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 90deg) * -1));

    opacity: .75;
  }

  50% {
    transform:
      rotate(calc(var(--start-angle) + 180deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 180deg) * -1));

    opacity: 1;
  }

  75% {
    transform:
      rotate(calc(var(--start-angle) + 270deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 270deg) * -1));

    opacity: .75;
  }

  100% {
    transform:
      rotate(calc(var(--start-angle) + 360deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 360deg) * -1));

    opacity: .45;
  }
}


/* ==========================================================
   WHEEL SELF ROTATION
========================================================== */

@keyframes pwWheelSpin {

  from {
    transform:
      translate(-50%, -50%)
      rotate(0deg);
  }

  to {
    transform:
      translate(-50%, -50%)
      rotate(360deg);
  }
}


/* ==========================================================
   CENTER PATHWHEELERS BRAND
========================================================== */

.wheel-brand-text {
  position: absolute;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%)
    scale(.9);

  text-align: center;

  z-index: 100;

  animation:
    pwBrandReveal 8s ease-in-out infinite;
}


.wheel-brand-main {
  color: #d00000;

  font-size: 29px;

  font-weight: 900;

  letter-spacing: 5px;

  white-space: nowrap;

  text-shadow:
    0 0 5px rgba(208,0,0,.18),
    0 0 18px rgba(208,0,0,.25);
}


.wheel-brand-sub {
  margin-top: 8px;

  color:
    rgba(255,255,255,.68);

  font-size: 12px;

  font-weight: 700;

  letter-spacing: 4px;

  white-space: nowrap;
}


/* ==========================================================
   BRAND REVEAL
========================================================== */

@keyframes pwBrandReveal {

  0% {
    opacity: .04;

    transform:
      translate(-50%, -50%)
      scale(.88);
  }

  20% {
    opacity: .18;

    transform:
      translate(-50%, -50%)
      scale(.92);
  }

  40% {
    opacity: .55;

    transform:
      translate(-50%, -50%)
      scale(.97);
  }

  55% {
    opacity: 1;

    transform:
      translate(-50%, -50%)
      scale(1);
  }

  70% {
    opacity: 1;

    transform:
      translate(-50%, -50%)
      scale(1);
  }

  85% {
    opacity: .35;

    transform:
      translate(-50%, -50%)
      scale(.96);
  }

  100% {
    opacity: .04;

    transform:
      translate(-50%, -50%)
      scale(.88);
  }
}


/* ==========================================================
   CENTER GLOW
========================================================== */

.wheel-brand-animation::after {
  content: "";

  position: absolute;

  left: 50%;
  top: 50%;

  width: 270px;
  height: 270px;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(208,0,0,.10),
      rgba(208,0,0,.035) 42%,
      transparent 72%
    );

  animation:
    pwCenterGlow 8s ease-in-out infinite;

  z-index: 1;
}


@keyframes pwCenterGlow {

  0% {
    opacity: .15;

    transform:
      translate(-50%, -50%)
      scale(.7);
  }

  50% {
    opacity: .8;

    transform:
      translate(-50%, -50%)
      scale(1);
  }

  100% {
    opacity: .15;

    transform:
      translate(-50%, -50%)
      scale(.7);
  }
}


/* ==========================================================
   AUTH RESPONSIVE
========================================================== */

@media (max-width: 1150px) {

  .auth-page {
    padding-left: 4vw;
  }

  .auth-card {
    width: 400px;
  }

  .wheel-brand-animation {
    right: -30px;

    width: 470px;
    height: 470px;
  }


  .wheel {
    width: 78px;
    height: 78px;

    margin-left: -39px;
    margin-top: -39px;

    border-width: 8px;
  }


  .wheel-inner {
    width: 48px;
    height: 48px;
  }


  .wheel-inner span {
    height: 46px;
  }


  .wheel-brand-main {
    font-size: 23px;

    letter-spacing: 3px;
  }


  .wheel-brand-sub {
    font-size: 10px;

    letter-spacing: 3px;
  }


  @keyframes pwOrbit {

    0% {
      transform:
        rotate(var(--start-angle))
        translateX(185px)
        rotate(calc(var(--start-angle) * -1));

      opacity: .45;
    }

    25% {
      transform:
        rotate(calc(var(--start-angle) + 90deg))
        translateX(185px)
        rotate(calc((var(--start-angle) + 90deg) * -1));

      opacity: .75;
    }

    50% {
      transform:
        rotate(calc(var(--start-angle) + 180deg))
        translateX(185px)
        rotate(calc((var(--start-angle) + 180deg) * -1));

      opacity: 1;
    }

    75% {
      transform:
        rotate(calc(var(--start-angle) + 270deg))
        translateX(185px)
        rotate(calc((var(--start-angle) + 270deg) * -1));

      opacity: .75;
    }

    100% {
      transform:
        rotate(calc(var(--start-angle) + 360deg))
        translateX(185px)
        rotate(calc((var(--start-angle) + 360deg) * -1));

      opacity: .45;
    }
  }
}


@media (max-width: 850px) {

  .wheel-brand-animation {
    opacity: .25;

    right: -140px;
  }

  .auth-card {
    margin-left: 0;
  }
}


@media (max-width: 700px) {

  .auth-page {
    justify-content: center;

    padding: 20px;
  }


  .auth-card {
    width: 100%;

    max-width: 430px;

    min-height: auto;

    padding:
      38px
      30px
      32px;
  }


  .wheel-brand-animation {
    display: none;
  }


  .auth-card h1 {
    font-size: 29px;

    margin-top: 42px;
  }
}


@media (max-width: 420px) {

  .auth-card {
    padding:
      32px
      24px
      28px;
  }


  .auth-brand h1 {
    font-size: 23px;
  }


  .auth-card h1 {
    font-size: 27px;
  }
}



/* ==========================================================
   MANUAL GUIDE
========================================================== */

.guide-grid {
  display: grid;

  grid-template-columns:
    repeat(2, minmax(0,1fr));

  gap: 18px;
}

.guide-card {
  position: relative;

  padding: 24px;

  overflow: hidden;

  border-radius: 18px;

  border:
    1px solid var(--border);

  background:
    linear-gradient(
      145deg,
      #151519,
      #0e0e11
    );

  box-shadow:
    var(--shadow-card);

  transition: var(--transition);
}

.guide-card:hover {
  transform:
    translateY(-4px);

  border-color:
    rgba(239,41,75,.22);

  box-shadow:
    var(--shadow-hover);
}

.guide-number {
  width: 36px;
  height: 36px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 10px;

  color: var(--red-bright);

  background:
    rgba(179,18,45,.09);

  border:
    1px solid rgba(239,41,75,.16);

  font-family: "Rajdhani", sans-serif;

  font-size: 14px;
  font-weight: 700;
}

.guide-card h3 {
  margin: 16px 0 8px;

  font-family: "Rajdhani", sans-serif;

  font-size: 22px;
}

.guide-card p {
  margin: 0;

  color: #71717a;

  font-size: 10px;

  line-height: 1.8;
}

.guide-step-list {
  margin-top: 15px;

  padding: 0;

  list-style: none;
}

.guide-step-list li {
  position: relative;

  padding-left: 17px;

  margin-bottom: 8px;

  color: #85858d;

  font-size: 9px;

  line-height: 1.65;
}

.guide-step-list li::before {
  content: "";

  position: absolute;

  left: 0;
  top: 6px;

  width: 5px;
  height: 5px;

  border-radius: 50%;

  background:
    var(--red);
}


/* ==========================================================
   CONFIRMATION BOX
========================================================== */

.confirm-box {
  padding: 18px;

  border-radius: 13px;

  border:
    1px solid rgba(227,179,65,.15);

  background:
    rgba(227,179,65,.045);

  color: #c9b77c;

  font-size: 10px;

  line-height: 1.7;
}

.confirm-box strong {
  display: block;

  margin-bottom: 5px;

  color: #e2cb83;

  font-size: 11px;
}


/* ==========================================================
   MOBILE MODALS
========================================================== */

@media (max-width: 600px) {
  .modal-overlay {
    padding: 13px;
  }

  .modal-card {
    padding: 23px;

    max-height: 94vh;
  }

  .payment-method-grid {
    grid-template-columns: 1fr;
  }

  .payment-method {
    min-height: 62px;

    flex-direction: row;

    justify-content: flex-start;

    padding: 10px 14px;
  }

  .transaction-preview-grid {
    grid-template-columns: 1fr;
  }

  .auth-page {
    padding: 15px;
  }

  .auth-card {
    padding: 27px 21px;
  }

  .guide-grid {
    grid-template-columns: 1fr;
  }

  .otp-box {
    gap: 5px;
  }
}

/* ==========================================================
   DASHBOARD — JSX MATCHING STYLES
========================================================== */

.dashboard-overview {
  display: grid;

  grid-template-columns:
    repeat(3, minmax(0, 1fr));

  gap: 17px;

  margin-top: 4px;
}

.dashboard-line {
  width: 100%;
  height: 1px;

  margin: 0 0 28px;

  background:
    linear-gradient(
      90deg,
      rgba(239,41,75,.45),
      rgba(255,255,255,.06),
      transparent
    );
}

.section-title-row {
  display: flex;

  align-items: flex-end;

  justify-content: space-between;

  gap: 20px;

  margin-bottom: 17px;
}

.section-title-row h2 {
  margin: 5px 0 0;

  font-family: "Rajdhani", sans-serif;

  font-size: 25px;
}

.count-pill {
  padding: 7px 11px;

  border-radius: 8px;

  color: #8b8b94;

  background:
    rgba(255,255,255,.035);

  border:
    1px solid var(--border);

  font-size: 9px;

  font-weight: 800;
}

.year-card.current {
  border-color:
    rgba(239,41,75,.28);

  box-shadow:
    0 20px 55px rgba(0,0,0,.3),
    0 0 35px rgba(179,18,45,.05);
}

.year-card-top {
  position: relative;

  z-index: 3;

  display: flex;

  align-items: center;

  justify-content: space-between;

  min-height: 35px;
}

.current-badge,
.year-status {
  display: inline-flex;

  align-items: center;

  padding: 6px 9px;

  border-radius: 7px;

  font-size: 8px;

  font-weight: 800;

  letter-spacing: 1px;
}

.current-badge {
  color: #ff7085;

  background:
    rgba(239,41,75,.09);

  border:
    1px solid rgba(239,41,75,.18);
}

.year-status {
  color: #606069;

  background:
    rgba(255,255,255,.035);

  border:
    1px solid rgba(255,255,255,.06);
}

.year-card-bottom {
  position: relative;

  z-index: 3;

  display: flex;

  align-items: center;

  justify-content: space-between;

  gap: 10px;

  margin-top: 21px;

  padding-top: 15px;

  border-top:
    1px solid rgba(255,255,255,.045);

  color: #707079;

  font-size: 9px;

  font-weight: 700;
}

.year-card-bottom span:last-child {
  color: #b34a5d;

  transition: .2s ease;
}

.year-card:hover .year-card-bottom span:last-child {
  color: #ff5d78;
}

.add-year-card {
  cursor: pointer;

  flex-direction: column;

  align-items: flex-start;

  justify-content: center;

  padding: 25px;

  text-align: left;
}

.add-year-symbol {
  position: relative;

  z-index: 2;

  width: 43px;
  height: 43px;

  margin-bottom: 16px;

  display: flex;

  align-items: center;
  justify-content: center;

  border-radius: 12px;

  color: var(--red-bright);

  background:
    rgba(179,18,45,.09);

  border:
    1px solid rgba(239,41,75,.18);

  font-size: 25px;

  font-weight: 300;

  transition: .25s ease;
}

.add-year-card:hover .add-year-symbol {
  transform:
    rotate(90deg)
    scale(1.05);

  background:
    rgba(239,41,75,.15);

  color: #fff;
}

.add-year-card strong {
  position: relative;

  z-index: 2;

  font-family: "Rajdhani", sans-serif;

  font-size: 21px;

  color: #dddde1;
}

.add-year-card > span {
  position: relative;

  z-index: 2;

  margin-top: 5px;

  color: #66666f;

  font-size: 9px;

  line-height: 1.5;
}

.overview-description {
  position: relative;

  z-index: 2;

  margin-top: 8px;

  color: #5f5f67;

  font-size: 9px;

  line-height: 1.5;
}

.overview-line {
  position: relative;

  z-index: 2;

  width: 100%;

  height: 1px;

  margin-top: 15px;

  background:
    linear-gradient(
      90deg,
      rgba(239,41,75,.35),
      transparent
    );
}

.overview-action-text {
  position: relative;

  z-index: 2;

  margin-top: 12px;

  color: #ededee;

  font-family: "Rajdhani", sans-serif;

  font-size: 22px;

  font-weight: 700;
}

.outline-button {
  position: relative;

  z-index: 3;

  width: 100%;

  min-height: 39px;

  margin-top: 15px;

  border-radius: 9px;

  border:
    1px solid rgba(239,41,75,.22);

  background:
    rgba(179,18,45,.055);

  color: #d85a70;

  font-size: 9px;

  font-weight: 800;

  transition: .2s ease;
}

.outline-button:hover {
  transform:
    translateY(-2px);

  color: #fff;

  border-color:
    rgba(239,41,75,.45);

  background:
    rgba(179,18,45,.13);

  box-shadow:
    0 10px 25px rgba(179,18,45,.08);
}


/* ==========================================================
   DASHBOARD RESPONSIVE
========================================================== */

@media (max-width: 900px) {
  .dashboard-overview {
    grid-template-columns:
      repeat(2, minmax(0,1fr));
  }
}

@media (max-width: 600px) {
  .dashboard-overview {
    grid-template-columns: 1fr;
  }

  .section-title-row {
    align-items: flex-start;

    flex-direction: column;
  }

  .count-pill {
    align-self: flex-start;
  }

  .year-card-bottom {
    margin-top: 18px;
  }
}

/* ==========================================================
   APP LAYOUT — SIDEBAR + MAIN CONTENT
========================================================== */

.pw-app {
  min-height: 100vh;
  width: 100%;

  background: #08080b;
}


.pw-main {
  min-height: 100vh;

  margin-left: 248px;

  width: calc(100% - 248px);

  min-width: 0;
}


.pw-content {
  width: 100%;
  max-width: 1500px;

  margin: 0 auto;

  padding: 34px 38px 60px;

  box-sizing: border-box;
}


/* ==========================================================
   DESKTOP SPACING
========================================================== */

@media (max-width: 1100px) {

  .pw-main {
    margin-left: 248px;

    width: calc(100% - 248px);
  }

  .pw-content {
    padding: 30px 28px 50px;
  }

}


/* ==========================================================
   MOBILE
========================================================== */

@media (max-width: 900px) {

  .pw-main {
    margin-left: 0;

    width: 100%;
  }

  .pw-content {
    padding: 26px 20px 45px;
  }

}


@media (max-width: 600px) {

  .pw-content {
    padding: 22px 15px 40px;
  }

}

/* ==========================================================
   ATTENDANCE PAGE — FINAL LAYOUT FIX
========================================================== */

.attendance-toolbar {
  width: 100%;
  display: grid;
  grid-template-columns: 180px minmax(250px, 1fr) 120px 120px;
  gap: 16px;
  align-items: end;
  margin: 24px 0;
}

.date-control,
.attendance-search {
  min-width: 0;
}

.date-control label,
.attendance-search label {
  display: block;
  margin-bottom: 8px;
  color: #777780;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.5px;
}

.date-control input,
.attendance-search input,
.notes-input {
  width: 100%;
  min-width: 0;
  height: 44px;
  padding: 0 13px;

  background: #15151b !important;
  color: #f7f7f8 !important;

  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 10px;

  outline: none;

  font-family: "Inter", sans-serif;
  font-size: 12px;

  box-shadow: none;

  transition:
    border-color .2s ease,
    background .2s ease,
    box-shadow .2s ease;
}

.date-control input:focus,
.attendance-search input:focus,
.notes-input:focus {
  background: #18181f !important;
  border-color: rgba(239,41,75,0.5);

  box-shadow:
    0 0 0 3px rgba(239,41,75,0.07);
}

.date-control input::placeholder,
.attendance-search input::placeholder,
.notes-input::placeholder {
  color: #5f5f68 !important;
  opacity: 1;
}

input[type="date"] {
  color-scheme: dark;
}


/* ATTENDANCE COUNTERS */

.attendance-stat {
  height: 44px;

  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 0 14px;

  background: #111116;

  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 10px;
}

.attendance-stat span {
  color: #6e6e78;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.2px;
}

.attendance-stat strong {
  color: #f7f7f8;

  font-family: "Rajdhani", sans-serif;

  font-size: 20px;
  font-weight: 700;
}


/* ATTENDANCE TABLE */

.attendance-table {
  width: 100%;

  overflow: hidden;

  background: #101014;

  border: 1px solid rgba(255,255,255,0.075);
  border-radius: 16px;
}

.table-header {
  display: grid;

  grid-template-columns:
    minmax(250px, 1.2fr)
    minmax(230px, 1fr)
    minmax(220px, 1fr);

  gap: 20px;

  padding: 14px 20px;

  background: #15151a;

  border-bottom:
    1px solid rgba(255,255,255,0.065);

  color: #65656e;

  font-size: 8px;
  font-weight: 800;

  letter-spacing: 1.5px;
}

.attendance-row {
  display: grid;

  grid-template-columns:
    minmax(250px, 1.2fr)
    minmax(230px, 1fr)
    minmax(220px, 1fr);

  gap: 20px;

  align-items: center;

  padding: 16px 20px;

  border-bottom:
    1px solid rgba(255,255,255,0.055);
}

.attendance-row:last-child {
  border-bottom: none;
}


/* EMPLOYEE */

.employee-cell {
  min-width: 0;

  display: flex;
  align-items: center;

  gap: 12px;
}

.employee-cell strong {
  display: block;

  color: #f1f1f3;

  font-size: 13px;
  font-weight: 700;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.employee-cell span {
  display: block;

  margin-top: 4px;

  color: #686871;

  font-size: 10px;
}


/* STATUS BUTTONS */

.attendance-actions {
  display: flex;
  align-items: center;

  gap: 8px;

  flex-wrap: wrap;
}

.status-button {
  min-height: 37px;

  display: inline-flex;
  align-items: center;
  justify-content: center;

  gap: 6px;

  padding: 0 12px;

  background: #17171d;

  border:
    1px solid rgba(255,255,255,0.08);

  border-radius: 9px;

  color: #777780;

  font-size: 11px;
  font-weight: 700;

  transition: .2s ease;
}

.status-button:hover {
  background: #1d1d24;
  color: #fff;
}

.status-button.present.active {
  background: rgba(67,200,121,0.10);

  border-color:
    rgba(67,200,121,0.35);

  color: #55d489;
}

.status-button.absent.active {
  background: rgba(239,41,75,0.10);

  border-color:
    rgba(239,41,75,0.35);

  color: #ef7187;
}


/* NOTES */

.notes-input {
  height: 40px !important;
}


/* FOOTER */

.attendance-footer {
  width: 100%;

  display: flex;
  align-items: center;
  justify-content: space-between;

  gap: 20px;

  margin-top: 18px;
  padding: 15px 18px;

  background: #101014;

  border:
    1px solid rgba(255,255,255,0.07);

  border-radius: 12px;
}

.attendance-footer span {
  color: #686871;

  font-size: 10px;
}


/* ==========================================================
   FORCE ALL FORM CONTROLS DARK
========================================================== */

input,
textarea,
select {
  background-color: #15151b !important;
  color: #f7f7f8 !important;
}

input::placeholder,
textarea::placeholder {
  color: #5f5f68 !important;
  opacity: 1;
}

input:focus,
textarea:focus,
select:focus {
  outline: none;
}


/* CHROME AUTOFILL */

input:-webkit-autofill,
input:-webkit-autofill:hover,
input:-webkit-autofill:focus {
  -webkit-text-fill-color: #f7f7f8 !important;

  -webkit-box-shadow:
    0 0 0 1000px #15151b inset !important;

  box-shadow:
    0 0 0 1000px #15151b inset !important;
}


/* ==========================================================
   ATTENDANCE RESPONSIVE
========================================================== */

@media (max-width: 1050px) {

  .attendance-toolbar {
    grid-template-columns:
      1fr 1fr;
  }

  .attendance-stat {
    width: 100%;
  }

  .attendance-table {
    overflow-x: auto;
  }

  .table-header,
  .attendance-row {
    min-width: 760px;
  }
}


@media (max-width: 600px) {

  .attendance-toolbar {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .attendance-row {
    padding: 14px;
  }

  .attendance-footer {
    flex-direction: column;
    align-items: stretch;
  }

  .attendance-footer button {
    width: 100%;
  }
}

/* ============================================================
   GAS PAYMENTS
   ============================================================ */

.gas-entry-card {
  width: 100%;
  margin-top: 24px;
  padding: 28px;
  background: #101014;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 18px;
  box-shadow: 0 18px 45px rgba(0,0,0,0.22);
  box-sizing: border-box;
}

.gas-entry-header {
  margin-bottom: 24px;
}

.gas-entry-header h2 {
  margin: 5px 0 8px;
  font-family: "Rajdhani", sans-serif;
  font-size: 26px;
  color: #f7f7f8;
}

.gas-entry-header p:not(.eyebrow) {
  margin: 0;
  color: #777780;
  font-size: 13px;
}

.gas-entry-form {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  width: 100%;
}

.gas-input-group {
  flex: 1;
  min-width: 0;
}

.gas-input-group label {
  display: block;
  margin-bottom: 8px;
  color: #c2c2c8;
  font-size: 12px;
  font-weight: 700;
}

.amount-input-wrapper {
  height: 48px;
  display: flex;
  align-items: center;
  background: #15151b;
  border: 1px solid rgba(255,255,255,0.09);
  border-radius: 11px;
  overflow: hidden;
}

.amount-input-wrapper span {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 14px;
  background: rgba(179,18,45,0.12);
  border-right: 1px solid rgba(255,255,255,0.07);
  color: #ef294b;
  font-size: 12px;
  font-weight: 800;
}

.amount-input-wrapper input {
  flex: 1;
  width: 100%;
  height: 100%;
  padding: 0 14px;
  border: none !important;
  outline: none !important;
  background: transparent !important;
  color: #f7f7f8 !important;
  font-size: 14px;
}

.amount-input-wrapper input::placeholder {
  color: #55555e;
}

.gas-add-button {
  height: 48px;
  min-width: 190px;
  white-space: nowrap;
}

.gas-add-button:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.section-heading {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 20px;
  margin-top: 42px;
  margin-bottom: 18px;
}

.section-heading h2 {
  margin: 5px 0 0;
  font-family: "Rajdhani", sans-serif;
  font-size: 26px;
  color: #f7f7f8;
}

.record-count {
  padding: 8px 12px;
  border-radius: 9px;
  background: #15151b;
  border: 1px solid rgba(255,255,255,0.07);
  color: #c2c2c8;
  font-size: 11px;
  font-weight: 700;
}

.gas-records {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}

.gas-record-card {
  display: flex;
  align-items: center;
  gap: 16px;
  min-width: 0;
  padding: 20px;
  background: #101014;
  border: 1px solid rgba(255,255,255,0.07);
  border-radius: 16px;
  transition:
    transform .2s ease,
    border-color .2s ease,
    background .2s ease;
}

.gas-record-card:hover {
  transform: translateY(-2px);
  border-color: rgba(239,41,75,0.28);
  background: #141419;
}

.gas-record-icon {
  width: 48px;
  height: 48px;
  flex: 0 0 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
  background: rgba(179,18,45,0.12);
  font-size: 22px;
}

.gas-record-main {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.gas-record-label {
  color: #777780;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: 1.2px;
}

.gas-record-main strong {
  color: #f7f7f8;
  font-family: "Rajdhani", sans-serif;
  font-size: 22px;
}

.gas-record-date {
  color: #777780;
  font-size: 11px;
}

.gas-empty {
  margin-top: 10px;
}

.empty-icon {
  font-size: 36px;
  margin-bottom: 12px;
}

@media (max-width: 700px) {
  .gas-entry-form {
    flex-direction: column;
    align-items: stretch;
  }

  .gas-add-button {
    width: 100%;
  }

  .gas-records {
    grid-template-columns: 1fr;
  }

  .section-heading {
    align-items: flex-start;
    flex-direction: column;
  }
}

/* ==========================================================
   PATHWHEELERS — LARGE ORBITING WHEELS
   ========================================================== */

.wheel-brand-animation {
  position: absolute;
  right: 6%;
  top: 50%;

  width: 540px;
  height: 540px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
  z-index: 50;
}


/* ==========================================================
   WHEEL
   ========================================================== */

.wheel {
  position: absolute;

  width: 92px;
  height: 92px;

  border: 9px solid #d00000;
  border-radius: 50%;

  box-sizing: border-box;

  left: 50%;
  top: 50%;

  margin-left: -46px;
  margin-top: -46px;

  box-shadow:
    0 0 14px rgba(208, 0, 0, 0.40),
    0 0 30px rgba(208, 0, 0, 0.15);

  animation:
    pwOrbit 0.1s linear infinite;
}


/* ==========================================================
   FOUR STARTING POSITIONS
   ========================================================== */

.wheel-top {
  --start-angle: 0deg;
}

.wheel-right {
  --start-angle: 90deg;
}

.wheel-bottom {
  --start-angle: 180deg;
}

.wheel-left {
  --start-angle: 270deg;
}


/* ==========================================================
   INNER WHEEL DETAIL
   ========================================================== */

.wheel-inner {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 58px;
  height: 58px;

  transform:
    translate(-50%, -50%);

  animation:
    pwWheelSpin 1.5s linear infinite;
}


.wheel-inner span {
  position: absolute;

  left: 50%;
  top: 50%;

  width: 4px;
  height: 56px;

  border-radius: 4px;

  background: #d00000;

  transform-origin: center;
}


.wheel-inner span:nth-child(1) {
  transform:
    translate(-50%, -50%)
    rotate(0deg);
}


.wheel-inner span:nth-child(2) {
  transform:
    translate(-50%, -50%)
    rotate(60deg);
}


.wheel-inner span:nth-child(3) {
  transform:
    translate(-50%, -50%)
    rotate(120deg);
}


/* ==========================================================
   WHEEL HUB
   ========================================================== */

.wheel::before {
  content: "";

  position: absolute;

  width: 22px;
  height: 22px;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  border: 4px solid #d00000;

  border-radius: 50%;

  box-sizing: border-box;
}


/* ==========================================================
   LARGE ORBIT
   ========================================================== */

@keyframes pwOrbit {

  0% {
    transform:
      rotate(var(--start-angle))
      translateX(220px)
      rotate(calc(var(--start-angle) * -1));

    opacity: 0.45;
  }

  25% {
    transform:
      rotate(calc(var(--start-angle) + 90deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 90deg) * -1));

    opacity: 0.75;
  }

  50% {
    transform:
      rotate(calc(var(--start-angle) + 180deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 180deg) * -1));

    opacity: 1;
  }

  75% {
    transform:
      rotate(calc(var(--start-angle) + 270deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 270deg) * -1));

    opacity: 0.75;
  }

  100% {
    transform:
      rotate(calc(var(--start-angle) + 360deg))
      translateX(220px)
      rotate(calc((var(--start-angle) + 360deg) * -1));

    opacity: 0.45;
  }

}


/* ==========================================================
   WHEEL'S OWN ROTATION
   ========================================================== */

@keyframes pwWheelSpin {

  from {
    transform:
      translate(-50%, -50%)
      rotate(0deg);
  }

  to {
    transform:
      translate(-50%, -50%)
      rotate(360deg);
  }

}


/* ==========================================================
   CENTER BRAND
   ========================================================== */

.wheel-brand-text {

  position: absolute;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%)
    scale(0.92);

  text-align: center;

  z-index: 100;

  animation:
    pwBrandReveal 8s ease-in-out infinite;
}


.wheel-brand-main {

  color: #d00000;

  font-size: 31px;

  font-weight: 900;

  letter-spacing: 5px;

  white-space: nowrap;

  text-shadow:
    0 0 4px rgba(208, 0, 0, 0.15),
    0 0 12px rgba(208, 0, 0, 0.25);
}


.wheel-brand-sub {

  margin-top: 8px;

  color: rgba(255, 255, 255, 0.75);

  font-size: 13px;

  font-weight: 700;

  letter-spacing: 4px;

  white-space: nowrap;
}


/* ==========================================================
   BRAND REVEAL
   ========================================================== */

@keyframes pwBrandReveal {

  0% {
    opacity: 0.04;

    transform:
      translate(-50%, -50%)
      scale(0.88);
  }

  20% {
    opacity: 0.18;

    transform:
      translate(-50%, -50%)
      scale(0.92);
  }

  40% {
    opacity: 0.55;

    transform:
      translate(-50%, -50%)
      scale(0.97);
  }

  55% {
    opacity: 1;

    transform:
      translate(-50%, -50%)
      scale(1);
  }

  70% {
    opacity: 1;

    transform:
      translate(-50%, -50%)
      scale(1);
  }

  85% {
    opacity: 0.35;

    transform:
      translate(-50%, -50%)
      scale(0.96);
  }

  100% {
    opacity: 0.04;

    transform:
      translate(-50%, -50%)
      scale(0.88);
  }

}


/* ==========================================================
   CENTER RED GLOW
   ========================================================== */

.wheel-brand-animation::after {

  content: "";

  position: absolute;

  left: 50%;
  top: 50%;

  width: 250px;
  height: 250px;

  transform:
    translate(-50%, -50%);

  border-radius: 50%;

  background:
    radial-gradient(
      circle,
      rgba(208, 0, 0, 0.10) 0%,
      rgba(208, 0, 0, 0.04) 40%,
      transparent 70%
    );

  animation:
    pwCenterGlow 8s ease-in-out infinite;

  z-index: 1;
}


@keyframes pwCenterGlow {

  0% {
    opacity: 0.15;

    transform:
      translate(-50%, -50%)
      scale(0.7);
  }

  50% {
    opacity: 0.8;

    transform:
      translate(-50%, -50%)
      scale(1);
  }

  100% {
    opacity: 0.15;

    transform:
      translate(-50%, -50%)
      scale(0.7);
  }

}


/* ==========================================================
   RESPONSIVE — MEDIUM SCREENS
   ========================================================== */

@media (max-width: 1100px) {

  .wheel-brand-animation {

    right: 1%;

    width: 440px;
    height: 440px;
  }

  .wheel {

    width: 78px;
    height: 78px;

    margin-left: -39px;
    margin-top: -39px;

    border-width: 8px;
  }

  .wheel-inner {

    width: 48px;
    height: 48px;
  }

  .wheel-inner span {

    height: 46px;
  }

  @keyframes pwOrbit {

    0% {
      transform:
        rotate(var(--start-angle))
        translateX(180px)
        rotate(calc(var(--start-angle) * -1));

      opacity: 0.45;
    }

    25% {
      transform:
        rotate(calc(var(--start-angle) + 90deg))
        translateX(180px)
        rotate(calc((var(--start-angle) + 90deg) * -1));

      opacity: 0.75;
    }

    50% {
      transform:
        rotate(calc(var(--start-angle) + 180deg))
        translateX(180px)
        rotate(calc((var(--start-angle) + 180deg) * -1));

      opacity: 1;
    }

    75% {
      transform:
        rotate(calc(var(--start-angle) + 270deg))
        translateX(180px)
        rotate(calc((var(--start-angle) + 270deg) * -1));

      opacity: 0.75;
    }

    100% {
      transform:
        rotate(calc(var(--start-angle) + 360deg))
        translateX(180px)
        rotate(calc((var(--start-angle) + 360deg) * -1));

      opacity: 0.45;
    }
  }

  .wheel-brand-main {

    font-size: 23px;

    letter-spacing: 3px;
  }

  .wheel-brand-sub {

    font-size: 10px;

    letter-spacing: 2px;
  }
}


/* ==========================================================
   MOBILE
   ========================================================== */

@media (max-width: 700px) {

  .wheel-brand-animation {
    display: none;
  }

}

/* ==========================================================
   PATHWHEELERS — MOBILE WHEEL FIX
   ========================================================== */

@media (max-width: 768px) {

  .auth-screen {
    position: relative;
    min-height: 100vh;
    overflow-y: auto;
    overflow-x: hidden;
    padding: 20px 16px 40px;
    display: block;
  }

  /* FORCE WHEEL TO BE VISIBLE ABOVE LOGIN CARD */

  .wheel-brand-animation {
    position: relative !important;

    top: auto !important;
    right: auto !important;
    left: auto !important;

    width: 280px !important;
    height: 280px !important;

    margin: 0 auto 25px auto !important;

    transform: none !important;

    display: flex !important;

    align-items: center !important;
    justify-content: center !important;

    pointer-events: none;

    z-index: 100 !important;

    visibility: visible !important;
    opacity: 1 !important;
  }

  /* WHEELS */

  .wheel {
    width: 54px !important;
    height: 54px !important;

    margin-left: -27px !important;
    margin-top: -27px !important;

    border-width: 6px !important;

    visibility: visible !important;
    opacity: 1 !important;
  }

  /* WHEEL CENTERS */

  .wheel-inner {
    width: 34px !important;
    height: 34px !important;
  }

  /* CENTER BRAND */

  .wheel-brand-text {
    position: absolute !important;

    left: 50% !important;
    top: 50% !important;

    transform:
      translate(-50%, -50%) !important;

    z-index: 120 !important;

    visibility: visible !important;
    opacity: 1 !important;

    text-align: center;
    white-space: nowrap;
  }

  .wheel-brand-main {
    font-size: 14px !important;
  }

  .wheel-brand-sub {
    font-size: 8px !important;
  }

  /* LOGIN CARD GOES UNDER THE WHEELS */

  .auth-card {
    position: relative !important;

    z-index: 10 !important;

    width: 100% !important;
    max-width: 430px !important;

    margin:
      0 auto !important;
  }
}


/* ==========================================================
   VERY SMALL PHONES
   ========================================================== */

@media (max-width: 480px) {

  .wheel-brand-animation {
    width: 230px !important;
    height: 230px !important;
    margin-bottom: 20px !important;
  }

  .wheel {
    width: 44px !important;
    height: 44px !important;

    margin-left: -22px !important;
    margin-top: -22px !important;

    border-width: 5px !important;
  }

  .wheel-inner {
    width: 27px !important;
    height: 27px !important;
  }

  .wheel-brand-main {
    font-size: 11px !important;
  }

  .wheel-brand-sub {
    font-size: 7px !important;
  }
}


/* ==========================================================
   TINY PHONES
   ========================================================== */

@media (max-width: 360px) {

  .wheel-brand-animation {
    width: 190px !important;
    height: 190px !important;
  }

  .wheel {
    width: 36px !important;
    height: 36px !important;

    margin-left: -18px !important;
    margin-top: -18px !important;

    border-width: 4px !important;
  }

  .wheel-inner {
    width: 22px !important;
    height: 22px !important;
  }

  .wheel-brand-main {
    font-size: 9px !important;
  }

  .wheel-brand-sub {
    font-size: 6px !important;
  }
}

/* ==========================================================
   PATHWHEELERS IMAGE WHEELS
   ========================================================== */

.wheel-brand-animation {
  position: absolute;
  right: 6%;
  top: 50%;

  width: 540px;
  height: 540px;

  transform: translateY(-50%);

  display: flex;
  align-items: center;
  justify-content: center;

  pointer-events: none;
  z-index: 50;
}


/* ----------------------------------------------------------
   INDIVIDUAL WHEEL
   ---------------------------------------------------------- */

.orbit-wheel {
  position: absolute;

  width: 82px;
  height: 82px;

  left: 50%;
  top: 50%;

  margin-left: -41px;
  margin-top: -41px;

  transform-origin: 50% 50%;
}


/* IMAGE */

.orbit-wheel img {
  width: 100%;
  height: 100%;

  object-fit: contain;

  display: block;

  border-radius: 50%;

  animation:
    wheelSelfSpin 0.7s linear infinite;
}


/* ----------------------------------------------------------
   FOUR STARTING POSITIONS
   ---------------------------------------------------------- */

.orbit-wheel-top {
  --start-angle: 0deg;
}

.orbit-wheel-right {
  --start-angle: 90deg;
}

.orbit-wheel-bottom {
  --start-angle: 180deg;
}

.orbit-wheel-left {
  --start-angle: 270deg;
}


/* ----------------------------------------------------------
   ORBIT
   ---------------------------------------------------------- */

.orbit-wheel {
  animation: wheelOrbit 0.6s linear infinite;
}


/* ----------------------------------------------------------
   SELF SPIN
   ---------------------------------------------------------- */

@keyframes wheelSelfSpin {

  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }

}


/* ----------------------------------------------------------
   REVOLUTION AROUND CENTER
   ---------------------------------------------------------- */

@keyframes wheelOrbit {

  from {

    transform:
      rotate(var(--start-angle))
      translateX(210px)
      rotate(calc(var(--start-angle) * -1));

  }

  to {

    transform:
      rotate(calc(var(--start-angle) + 360deg))
      translateX(210px)
      rotate(calc((var(--start-angle) + 360deg) * -1));

  }

}


/* ----------------------------------------------------------
   CENTER BRAND
   ---------------------------------------------------------- */

.wheel-brand-text {
  position: absolute;

  left: 50%;
  top: 50%;

  transform:
    translate(-50%, -50%);

  text-align: center;

  white-space: nowrap;

  z-index: 10;

  pointer-events: none;
}


/* ----------------------------------------------------------
   BRAND TEXT
   ---------------------------------------------------------- */

.wheel-brand-main {
  font-size: 19px;
  font-weight: 800;

  letter-spacing: 0.12em;

  color: rgba(255,255,255,0.9);
}

.wheel-brand-sub {
  margin-top: 5px;

  font-size: 10px;
  font-weight: 600;

  letter-spacing: 0.24em;

  color: rgba(208,0,0,0.85);
}


/* ==========================================================
   TABLET
   ========================================================== */

@media (max-width: 1100px) {

  .wheel-brand-animation {
    width: 420px;
    height: 420px;
    right: 2%;
  }

  .orbit-wheel {
    width: 65px;
    height: 65px;

    margin-left: -32.5px;
    margin-top: -32.5px;
  }

  @keyframes wheelOrbit {

    from {

      transform:
        rotate(var(--start-angle))
        translateX(165px)
        rotate(calc(var(--start-angle) * -1));

    }

    to {

      transform:
        rotate(calc(var(--start-angle) + 360deg))
        translateX(165px)
        rotate(calc((var(--start-angle) + 360deg) * -1));

    }

  }

}


/* ==========================================================
   MOBILE
   ========================================================== */

@media (max-width: 768px) {

  .auth-screen {
    overflow-x: hidden;
    overflow-y: auto;
  }

  .wheel-brand-animation {

    position: relative;

    top: auto;
    right: auto;

    width: 270px;
    height: 270px;

    transform: none;

    margin:
      10px auto
      25px;

  }

  .orbit-wheel {

    width: 48px;
    height: 48px;

    margin-left: -24px;
    margin-top: -24px;
  }

  @keyframes wheelOrbit {

    from {

      transform:
        rotate(var(--start-angle))
        translateX(105px)
        rotate(calc(var(--start-angle) * -1));

    }

    to {

      transform:
        rotate(calc(var(--start-angle) + 360deg))
        translateX(105px)
        rotate(calc((var(--start-angle) + 360deg) * -1));

    }

  }

  .wheel-brand-main {
    font-size: 12px;
  }

  .wheel-brand-sub {
    font-size: 7px;
  }

}


/* ==========================================================
   SMALL PHONES
   ========================================================== */

@media (max-width: 480px) {

  .wheel-brand-animation {
    width: 220px;
    height: 220px;
  }

  .orbit-wheel {

    width: 38px;
    height: 38px;

    margin-left: -19px;
    margin-top: -19px;
  }

  @keyframes wheelOrbit {

    from {

      transform:
        rotate(var(--start-angle))
        translateX(82px)
        rotate(calc(var(--start-angle) * -1));

    }

    to {

      transform:
        rotate(calc(var(--start-angle) + 360deg))
        translateX(82px)
        rotate(calc((var(--start-angle) + 360deg) * -1));

    }

  }
    

}
`;