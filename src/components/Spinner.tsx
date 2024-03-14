

export type SpinnerSize = 'sm' | 'md' | 'lg'
export default function Spinner({
    size = "sm",
    tip = undefined
}: {size?:SpinnerSize, tip?: string | null}) {
    return <div className="flex flex-col items-center">
        <div className={`spinner spinner-${size}`}/>
        {tip && <div className="text-[lightgray] text-[14px] p-2">{tip}</div>}
    </div>
}