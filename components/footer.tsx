import { Link } from "@heroui/link";
import CustomLink from "./custom-link";

export default function Footer() {
  return (
    <footer className="mx-0 my-4 flex w-full flex-col gap-1 px-4 text-xs sm:mx-auto sm:my-12 sm:h-5 sm:max-w-3xl sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex flex-col gap-1 sm:flex-row">
        <CustomLink href="/term&conditions">Terms & Conditions</CustomLink>
        {/* <CustomLink href="https://www.npmjs.com/package/next-auth">
          NPM
        </CustomLink> */}
      </div>
      <div className="flex items-center justify-start gap-2">
        {/* <CustomLink href="https://npmjs.org/package/next-auth">
          {packageJSON.version}
        </CustomLink> */}
      </div>
      <div className="text-xs">
        {" "}
        © {new Date().getFullYear()} reallythinks. Created by{" "}
        <Link
          color="success"
          className="text-xs"
          href="https://www.instagram.com/uneerajrekwar"
          target="_blank"
          rel="noopener noreferrer"
        >
          neerajrekwar
        </Link>
      </div>
    </footer>
  );
}
