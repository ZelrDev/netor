export const UserButton = (props: {
  icon: any;
  text: string;
  onClick: () => void;
}) => {
  return (
    <div
      onClick={props.onClick}
      className={`duration-400 w-full cursor-pointer rounded-lg border bg-gray-50 shadow transition hover:-translate-y-1 hover:shadow-lg`}
    >
      <div className="flex items-center">
        <div className="flex-none items-center justify-center rounded-l-lg border-r bg-white p-3">
          <div className="h-24 w-24 p-2">
            <props.icon className="h-full w-full text-gray-900" />
          </div>
        </div>
        <div className="pointer-events-none grow px-4">
          <h2 className="text-xl font-bold">{props.text}</h2>
        </div>
      </div>
    </div>
  );
};
