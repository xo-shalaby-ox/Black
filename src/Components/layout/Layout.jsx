import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <>
      {/* <div className="container mx-auto relative pt-20">
        {userLogin != null ? (
          <div className="icons-info fixed z-40 right-0 top-32 bg-blue-400 w-[60px] h-[140px] flex flex-col justify-evenly items-center gap-y-3 rounded-s">
            <div className="cart-icon flex justify-center items-center relative w-full">
              <Link to="cart">
                <i className="fa-solid fa-cart-shopping fa-shake text-xl"></i>
                {count ? (
                  <span className="absolute bg-red-500 top-[-12px] right-0 w-6 h-6 text-center rounded-full">
                    {count}
                  </span>
                ) : null}
              </Link>
            </div>
            <div className="wishList-icon flex justify-center items-center relative w-full">
              <Link to="wishlist">
                <div className="relative whishList-icon flex justify-center items-center w-full">
                  <i className="fa-solid fa-heart fa-beat text-xl"></i>
                  {wishCount ? (
                    <span className="absolute bg-red-500 top-[-12px] right-[-19px] w-6 h-6 text-center rounded-full">
                      {wishCount}
                    </span>
                  ) : null}
                </div>
              </Link>
            </div>
          </div>
        ) : null}
        <SocialInfo />
      </div> */}
      <Outlet />
      {/* <Footer /> */}
    </>
  );
}
