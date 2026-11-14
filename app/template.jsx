// Re-mounts on every navigation, so each page fades in instead of snapping.
export default function Template({ children }) {
  return <div className="pg">{children}</div>;
}
