import Link from "next/link";

export default function NotFound() {
    return (
        <div className="notFoundContainer">
            <h1>Page not found</h1>
            <p>The page you're looking for does not exist.</p>
            <Link href="/" className="backToHome">Back to StayFinder</Link>
        </div>
    )
}