import Link from "next/link";

export default function NotFound() {
    return (
        <div>
            <h1>Page not found</h1>
            <p>The page you're looking for does not exist.</p>
            <Link href="/">Back to StayFinder</Link>
        </div>
    )
}