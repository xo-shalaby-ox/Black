import { Visibility, VisibilityOff } from "@mui/icons-material";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import VpnKeyOffIcon from "@mui/icons-material/VpnKeyOff";
import {
  Checkbox,
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
import { userContext } from "@/Context/userContext/UserContext";
import { BackgroundBeams } from "@/Components/ui/background-beams";

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

  // checkbox handler
  const handleChange = (event) => {
    setChecked(event.target.checked);
  };

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
      // <div className="relative z-0 w-full mb-5 group">
      //   <input
      //     type="email"
      //     name="email"
      //     id="input-email"
      //     className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
      //     placeholder=" "
      //     onChange={formik.handleChange}
      //     onBlur={formik.handleBlur}
      //     value={formik.values.email}
      //   />
      //   <label
      //     htmlFor="input-email"
      //     className="flex items-center gap-x-2 peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-blue-600"
      //   >
      //     <i className="fa-solid fa-envelope fa-bounce text-blue-600"></i>
      //     <span>Email address</span>
      //   </label>
      //   {formik.errors.email && formik.touched.email && (
      //     <p className="text-red-600 text-sm mt-2 font-medium">
      //       {formik.errors.email}
      //     </p>
      //   )}
      // </div>
      <FormControl fullWidth variant="standard">
        <InputLabel
          sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
          htmlFor="Email"
        >
          <AlternateEmailIcon className="text-blue-600" />
          <span>Email Address</span>
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
          <VpnKeyOffIcon className="text-blue-600" />
          <span>Password</span>
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
            <InputAdornment position="end">
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
            <h2 className="w-full mb-3 p-4 font-bold text-2xl text-center">
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
                <label className="flex items-center text-sm lg:text-lg">
                  <Checkbox
                    checked={checked}
                    onChange={handleChange}
                    inputProps={{ "aria-label": "controlled" }}
                  />
                  Remember Me
                </label>
                <Link
                  to="/forgetPassword"
                  className="text-sm lg:text-lg text-blue-500 hover:underline hover:text-blue-800 duration-300"
                >
                  Forget Password..?
                </Link>
              </div>

              {/* Buttons */}
              <div className="btns flex flex-col gap-3">
                <button
                  type="submit"
                  className="text-white bg-blue-700 hover:bg-blue-800 duration-300 font-medium rounded-lg text-sm w-full p-3 text-center cursor-pointer"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Login"
                  )}
                </button>
                <span className="block text-center relative"> OR </span>
                <Link to="/signup">
                  <button
                    type="button"
                    className="text-slate-950 bg-slate-100 border border-blue-800 hover:bg-blue-800 hover:text-white duration-300 font-medium rounded-lg text-sm w-full p-3 text-center cursor-pointer"
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
