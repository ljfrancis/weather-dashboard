export const Footer = () => {
  return (
    <div className="relative">
      <div className="my-10 text-sm text-center text-gray-600 dark:text-gray-400">
        <span>Created by </span>
        <a
          href="https://lydiajanefrancis.com"
          target="_blank"
          className="hover:text-gray-500"
        >
          Lydia Francis
        </a>
        <span> © {new Date().getFullYear()}</span>
      </div>
    </div>
  )
}
