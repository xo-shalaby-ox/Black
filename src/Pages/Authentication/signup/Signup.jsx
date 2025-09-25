import { BackgroundBeams } from "@/Components/ui/background-beams";
import { userContext } from "@/Context/userContext/UserContext";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import KeyboardDoubleArrowRightRoundedIcon from "@mui/icons-material/KeyboardDoubleArrowRightRounded";
import PhoneMissedRoundedIcon from "@mui/icons-material/PhoneMissedRounded";
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
import { useContext, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as yup from "yup";
import loginPic from "../../../assets/login.gif";

// ✅ Reusable password field
// function PasswordField({
//   label,
//   name,
//   formik,
//   showPassword,
//   toggleShowPassword,
// }) {
//   return (
//     <FormControl sx={{ width: "100%" }} variant="standard">
//       <InputLabel
//         sx={{
//           display: "flex",
//           alignItems: "center",
//           columnGap: 1,
//           overflow: "visible",
//         }}
//         htmlFor={name}
//       >
//         <VpnKeyOffIcon className="text-blue-600" />
//         <span>{label}</span>
//       </InputLabel>
//       <Input
//         id={name}
//         type={showPassword ? "text" : "password"}
//         name={name}
//         value={formik.values[name]}
//         onChange={formik.handleChange}
//         onBlur={formik.handleBlur}
//         error={formik.touched[name] && Boolean(formik.errors[name])}
//         endAdornment={
//           <InputAdornment position="end">
//             <IconButton onClick={toggleShowPassword} edge="end">
//               {showPassword ? <VisibilityOff /> : <Visibility />}
//             </IconButton>
//           </InputAdornment>
//         }
//       />
//       <FormHelperText error>
//         {formik.touched[name] && formik.errors[name]}
//       </FormHelperText>
//     </FormControl>
//   );
// }

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLogin } = useContext(userContext);
  const navigate = useNavigate();

  // const toggleShowPassword = () => setShowPassword((prev) => !prev);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event) => {
    event.preventDefault();
  };

  // ✅ Validation schema memoized
  const validationSchema = useMemo(
    () =>
      yup.object({
        name: yup
          .string()
          .min(3, "Min length 3..!")
          .max(15, "Max length 15..!")
          .required("Name is required")
          .matches(/^[A-Z]/, "Name must start with a capital letter.")
          .matches(
            /^[A-Za-z0-9]+$/,
            "Name can only contain letters and numbers."
          ),
        email: yup
          .string()
          .email("Not valid email")
          .required("Email is required")
          .matches(
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "Email must be a valid format"
          ),
        password: yup
          .string()
          .min(8, "Min characters 8")
          .required("Password is required"),
        rePassword: yup
          .string()
          .oneOf([yup.ref("password")], "Passwords do not match")
          .required("Confirm password is required"),
        phone: yup
          .string()
          .matches(/^01[1250][0-9]{8}$/, "Phone not valid")
          .required("Phone is required"),
      }),
    []
  );

  const formik = useFormik({
    initialValues: {
      email: "",
      name: "",
      password: "",
      rePassword: "",
      phone: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        const res = await axios.post(
          "https://ecommerce.routemisr.com/api/v1/auth/signup",
          values
        );
        if (res.data.message === "success") {
          toast.success("Account created successfully");
          localStorage.setItem("userToken", res.data.token);
          setUserLogin(res.data.token);
          navigate("/login");
        }
      } catch (error) {
        toast.error("Account already exists!");
      } finally {
        setIsLoading(false);
      }
    },
  });

  return (
    <>
      <div className="signup-page relative container mx-auto row mt-32 my-20 rounded-lg z-40">
        <div className="w-1/2 p-5 hidden lg:block">
          <div className="signup-pic my-10">
            <img className="mx-auto" src={loginPic} alt="signup" />
          </div>
        </div>

        <div className="w-full lg:w-1/2 p-5">
          <div className="signup-form lg:p-5">
            <h2 className="w-full mb-3 p-4 font-bold text-2xl text-slate-200">
              Register Now...
            </h2>

            <form className="w-full p-4" onSubmit={formik.handleSubmit}>
              {/* Name */}
              <FormControl fullWidth variant="standard">
                <InputLabel
                  sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
                  htmlFor="input-name"
                >
                  <BadgeRoundedIcon className="text-yellow-600" />
                  <span className="text-slate-200">Your name</span>
                </InputLabel>
                <Input
                  id="input-name"
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.name && Boolean(formik.errors.name)}
                />
                <FormHelperText error>
                  {formik.touched.name && formik.errors.name}
                </FormHelperText>
              </FormControl>

              {/* Email */}
              <FormControl fullWidth variant="standard">
                <InputLabel
                  sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
                  htmlFor="input-email"
                >
                  <AlternateEmailRoundedIcon className="text-yellow-600" />
                  <span className="text-slate-200">Email address</span>
                </InputLabel>
                <Input
                  id="input-email"
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

              {/* Password */}
              <FormControl fullWidth variant="standard">
                <InputLabel
                  htmlFor="password"
                  sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
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
                  error={
                    formik.touched.password && Boolean(formik.errors.password)
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
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
              {/* Confirm Password */}

              <FormControl fullWidth variant="standard">
                <InputLabel
                  htmlFor="rePassword"
                  sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
                >
                  <VpnKeyOffIcon className="text-yellow-600" />
                  <span className="text-slate-200">RePassword</span>
                </InputLabel>
                <Input
                  id="rePassword"
                  type={showPassword ? "text" : "password"}
                  name="rePassword"
                  value={formik.values.rePassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={
                    formik.touched.rePassword &&
                    Boolean(formik.errors.rePassword)
                  }
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={
                          showPassword
                            ? "hide the password"
                            : "display the password"
                        }
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        onMouseUp={handleMouseUpPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
                <FormHelperText error>
                  {formik.touched.rePassword && formik.errors.rePassword}
                </FormHelperText>
              </FormControl>
              {/* Phone */}
              <FormControl fullWidth variant="standard">
                <InputLabel
                  sx={{ display: "flex", alignItems: "center", columnGap: 1 }}
                  htmlFor="input-phone"
                >
                  <PhoneMissedRoundedIcon className="text-yellow-600" />
                  <span className="text-slate-200">Phone</span>
                </InputLabel>
                <Input
                  id="input-phone"
                  type="tel"
                  name="phone"
                  value={formik.values.phone}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  error={formik.touched.phone && Boolean(formik.errors.phone)}
                />
                <FormHelperText error>
                  {formik.touched.phone && formik.errors.phone}
                </FormHelperText>
              </FormControl>

              {/* Submit */}
              <div className="btns flex justify-center items-center flex-col gap-y-5">
                <button
                  type="submit"
                  className="cursor-pointer text-white mt-5 bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-yellow-700 font-medium rounded-lg text-sm w-full px-5 py-2.5 duration-300"
                >
                  {isLoading ? (
                    <i className="fa-solid fa-spinner fa-spin"></i>
                  ) : (
                    "Register"
                  )}
                </button>
                <div className="btn-log flex justify-center items-center gap-x-1 p-3 rounded-xl self-start bg-slate-200 text-black hover:bg-yellow-700 hover:text-slate-200 duration-300 cursor-pointer">
                  <Link className="font-bold uppercase" to="/login">
                    login
                  </Link>
                  <KeyboardDoubleArrowRightRoundedIcon className="arrow-icon" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </>
  );
}
