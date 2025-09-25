import { BackgroundBeams } from "@/Components/ui/background-beams";
import { userContext } from "@/Context/userContext/UserContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VpnKeyOffIcon from "@mui/icons-material/VpnKeyOff";
import {
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputAdornment,
  InputLabel,
} from "@mui/material";
import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import loginPic from "../../../assets/login.gif";

// ✅ Move schema outside the component to avoid re-creating it each render
const validationSchema = yup.object().shape({
  email: yup
    .string()
    .email("Not Valid Email")
    .required("Email Is Required ...")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email must be a valid format"
    ),
  password: yup
    .string()
    .min(6, "Min Char Is 6")
    .required("Password Is Required ..."),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(true);
  const { setUserLogin, setUserName } = useContext(userContext);
  const navigate = useNavigate();

  // ✅ Memoized toggle function to avoid unnecessary re-renders
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword((prev) => !prev);
  }, []);

  // ✅ Login handler optimized
  const handleLogin = useCallback(
    async (values) => {
      setIsLoading(true);
      try {
        const { data } = await axios.post(
          `https://ecommerce.routemisr.com/api/v1/auth/signin`,
          values
        );

        if (data?.message === "success") {
          toast.success(data.message);

          localStorage.setItem("userName", data.user.name);
          localStorage.setItem("userToken", data.token);

          setUserName(data.user.name);
          setUserLogin(data.token);

          navigate("/");
        }
      } catch (error) {
        const errorMessage =
          error?.response?.data?.message ||
          "An error occurred. Please try again.";
        toast.error(errorMessage);
        navigate("/signup");
      } finally {
        setIsLoading(false);
      }
    },
    [navigate, setUserLogin, setUserName]
  );

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema,
    onSubmit: handleLogin,
  });

  // ✅ Extracted email field for clarity
  const EmailField = useMemo(
    () => (
      <FormControl fullWidth variant="standard">
        <InputLabel
          sx={{
            display: "flex",
            alignItems: "center",
            columnGap: 1,
          }}
          htmlFor="Email"
        >
          <AlternateEmailIcon className="text-yellow-600" />
          <span className="text-slate-200">Email Address</span>
        </InputLabel>
        <Input
          id="Email"
          type="email"
          name="email"
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.email && Boolean(formik.errors.email)}
        />
        <FormHelperText error>
          {formik.touched.email && formik.errors.email}
        </FormHelperText>
      </FormControl>
    ),
    [formik.values.email, formik.errors.email, formik.touched.email]
  );

  // ✅ Extracted password field
  const PasswordField = useMemo(
    () => (
      <FormControl fullWidth variant="standard">
        <InputLabel
          sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
          htmlFor="password"
        >
          <VpnKeyOffIcon className="text-yellow-600" />
          <span className="text-slate-200">Password</span>
        </InputLabel>
        <Input
          id="password"
          type={showPassword ? "text" : "password"}
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          endAdornment={
            <InputAdornment position="end" className="text-yellow-400">
              <IconButton
                aria-label={showPassword ? "hide password" : "show password"}
                onClick={togglePasswordVisibility}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        <FormHelperText error>
          {formik.touched.password && formik.errors.password}
        </FormHelperText>
      </FormControl>
    ),
    [
      formik.values.password,
      formik.errors.password,
      formik.touched.password,
      showPassword,
      togglePasswordVisibility,
    ]
  );

  return (
    <>
      <div className="login-page container mx-auto mt-32 relative row my-20 rounded-lg z-40">
        {/* Left Image Section */}
        <div className="w-1/2 p-5 hidden lg:block">
          <div className="login-pic my-10">
            <img className="mx-auto" src={loginPic} alt="login_picture" />
          </div>
        </div>

        {/* Right Form Section */}
        <div className="w-full lg:w-1/2 p-5">
          <div className="login-form lg:p-5">
            <h2 className="w-full mb-3 p-4 font-bold text-2xl text-center text-slate-200">
              Welcome Back...
            </h2>
            <p className="text-center text-slate-400 mb-6">
              Please log in or sign up to continue using our app.
            </p>

            <form className="w-full lg:p-4" onSubmit={formik.handleSubmit}>
              {EmailField}
              {PasswordField}

              {/* Remember Me + Forget Password */}
              <div className="forget-pass flex justify-between items-center mt-5 mb-5">
                <div className="checkbox-wrapper-46">
                  <input type="checkbox" id="cbx-46" className="inp-cbx" />
                  <label htmlFor="cbx-46" className="cbx">
                    <span>
                      <svg viewBox="0 0 12 10" height="10px" width="12px">
                        <polyline points="1.5 6 4.5 9 10.5 1"></polyline>
                      </svg>
                    </span>
                    <span className="text-slate-200">Remember ME</span>
                  </label>
                </div>

                <Link
                  to="/forgetPassword"
                  className="text-sm lg:text-lg text-yellow-600 hover:underline hover:text-yellow-800 duration-300"
                >
                  Forget Password..?
                </Link>
              </div>

              {/* Buttons */}
              <div className="btns flex flex-col gap-3">
                <button
                  type="submit"
                  className="text-white bg-yellow-600 hover:bg-yellow-700 duration-300 font-medium rounded-lg text-sm w-full p-3 text-center cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Login"
                  )}
                </button>
                <span className="block text-center relative text-slate-200">
                  OR
                </span>
                <Link to="/signup">
                  <button
                    type="button"
                    className="text-slate-950 bg-slate-100 border border-slate-50 hover:bg-yellow-700 hover:border-yellow-700 hover:text-white duration-300 font-medium rounded-lg text-sm w-full p-3 text-center cursor-pointer"
                  >
                    Register
                  </button>
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </>
  );
}
