import { Visibility, VisibilityOff } from "@mui/icons-material";
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
import { useNavigate } from "react-router-dom";
import * as yup from "yup";
import loginPic from "../../../assets/login.gif";
import { userContext } from "@/Context/userContext/UserContext";
import { BackgroundBeams } from "@/Components/ui/background-beams";
import BadgeRoundedIcon from "@mui/icons-material/BadgeRounded";
import AlternateEmailRoundedIcon from "@mui/icons-material/AlternateEmailRounded";
import VpnKeyOffIcon from "@mui/icons-material/VpnKeyOff";

// ✅ Reusable password field
function PasswordField({
  label,
  name,
  formik,
  showPassword,
  toggleShowPassword,
}) {
  return (
    <FormControl sx={{ width: "100%" }} variant="standard">
      <InputLabel
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: 1,
          overflow: "visible",
        }}
        htmlFor={name}
      >
        <VpnKeyOffIcon className="text-blue-600" />
        <span>{label}</span>
      </InputLabel>
      <Input
        id={name}
        type={showPassword ? "text" : "password"}
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        error={formik.touched[name] && Boolean(formik.errors[name])}
        endAdornment={
          <InputAdornment position="end">
            <IconButton onClick={toggleShowPassword} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
      />
      <FormHelperText error>
        {formik.touched[name] && formik.errors[name]}
      </FormHelperText>
    </FormControl>
  );
}

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setUserLogin } = useContext(userContext);
  const navigate = useNavigate();

  const toggleShowPassword = () => setShowPassword((prev) => !prev);

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
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="text"
                  name="name"
                  id="input-name"
                  className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  {...formik.getFieldProps("name")}
                />
                <label
                  htmlFor="input-name"
                  className="flex items-center gap-x-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  <BadgeRoundedIcon className="text-blue-600" />
                  <span>Your name</span>
                </label>
                {formik.touched.name && formik.errors.name && (
                  <div className="text-red-600 text-sm mt-2 font-medium">
                    {formik.errors.name}
                  </div>
                )}
              </div>

              {/* Email */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="email"
                  name="email"
                  id="input-email"
                  className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  {...formik.getFieldProps("email")}
                />
                <label
                  htmlFor="input-email"
                  className="flex items-center gap-x-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  <AlternateEmailRoundedIcon className="text-blue-600" />
                  <span>Email address</span>
                </label>
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-600 text-sm mt-2 font-medium">
                    {formik.errors.email}
                  </div>
                )}
              </div>

              {/* Password */}
              <div className="relative z-0 w-full mb-5 group">
                <PasswordField
                  label="New Password"
                  name="password"
                  formik={formik}
                  showPassword={showPassword}
                  toggleShowPassword={toggleShowPassword}
                />
              </div>

              {/* Confirm Password */}
              <div className="relative z-0 w-full mb-5 group">
                <PasswordField
                  label="Confirm Password"
                  name="rePassword"
                  formik={formik}
                  showPassword={showPassword}
                  toggleShowPassword={toggleShowPassword}
                />
              </div>

              {/* Phone */}
              <div className="relative z-0 w-full mb-5 group">
                <input
                  type="tel"
                  name="phone"
                  id="input-phone"
                  className="block py-2.5 px-0 w-full text-sm text-slate-100 bg-transparent border-0 border-b-2 border-gray-300 focus:outline-none focus:ring-0 focus:border-blue-600 peer"
                  placeholder=" "
                  {...formik.getFieldProps("phone")}
                />
                <label
                  htmlFor="input-phone"
                  className="flex items-center gap-x-2 absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                >
                  <i className="fa-solid fa-phone fa-bounce text-blue-600"></i>
                  <span>Phone</span>
                </label>
                {formik.touched.phone && formik.errors.phone && (
                  <div className="text-red-600 text-sm mt-2 font-medium">
                    {formik.errors.phone}
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-5 py-2.5 duration-300"
              >
                {isLoading ? (
                  <i className="fa-solid fa-spinner fa-spin"></i>
                ) : (
                  "Register"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      <BackgroundBeams />
    </>
  );
}
