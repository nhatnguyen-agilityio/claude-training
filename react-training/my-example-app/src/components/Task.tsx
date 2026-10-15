import type { TaskData } from "../types/task";

type TaskProps = {
    task: TaskData;
    onArchiveTask: (id: string) => void;
    onPinTask: (id: string) => void;
    onChangeTask: (value: string) => void;
};

export default function Task({
    task: { id, title, state },
    onArchiveTask,
    onPinTask,
    onChangeTask,
}: TaskProps) {
    return (
        <div className={`list-item ${state}`}>
            <label
                htmlFor={`archiveTask-${id}`}
                aria-label={`archiveTask-${id}`}
                className="checkbox"
            >
                <input
                    type="checkbox"
                    name="checked"
                    id={`archiveTask-${id}`}
                    checked={state === "TASK_ARCHIVED"}
                    onChange={(e) => onChangeTask(e.target.value)}
                />
                <span className="checkbox-custom" onClick={() => onArchiveTask(id)} />
            </label>
            <label htmlFor={`title-${id}`} aria-label={title} className="title">
                <input
                    type="text"
                    value={title}
                    readOnly={true}
                    name="title"
                    id={`title-${id}`}
                    placeholder="Input title"
                />
            </label>
            {state !== "TASK_ARCHIVED" && (
                <button
                    className="pin-button"
                    onClick={() => onPinTask(id)}
                    id={`pinTask-${id}`}
                    aria-label={`pinTask-${id}`}
                    key={`pinTask-${id}`}
                >
                    <span className={`icon-star`} />
                </button>
            )}
        </div>
    );
}
