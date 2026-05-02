import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

const LatestJobCards = ({job}) => {
    const navigate = useNavigate();
    const { allAppliedJobs } = useSelector((store) => store.job);
    const isApplied = allAppliedJobs?.some((appliedJob) => appliedJob?.job?._id === job?._id);
    const companyInitial = job?.company?.name?.charAt(0)?.toUpperCase() || 'C';

    return (
        <div onClick={()=> navigate(`/description/${job._id}`)} className='flex min-h-[320px] cursor-pointer flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg'>
            <div className='flex items-center gap-3'>
                <Avatar className='h-12 w-12 rounded-2xl border border-slate-200 bg-slate-50'>
                    <AvatarImage src={job?.company?.logo} alt={job?.company?.name || 'Company logo'} />
                    <AvatarFallback>{companyInitial}</AvatarFallback>
                </Avatar>
                <div>
                    <h1 className='text-lg font-semibold text-slate-900'>{job?.company?.name}</h1>
                    <p className='text-sm text-slate-500'>{job?.location || 'India'}</p>
                </div>
            </div>
            <div className='mt-4 flex-1'>
                <h1 className='mb-2 text-2xl font-bold leading-tight text-slate-900'>{job?.title}</h1>
                <p
                    className='text-sm leading-7 text-slate-600'
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 5,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                    }}
                >
                    {job?.description}
                </p>
            </div>
            <div className='mt-5 flex flex-wrap gap-2'>
                <Badge className={'border-0 bg-blue-50 text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'border-0 bg-rose-50 text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'border-0 bg-violet-50 text-[#7209b7] font-bold'} variant="ghost">{job?.salary}</Badge>
                {job?.jobDuration ? <Badge className={'border-0 bg-emerald-50 text-emerald-700 font-bold'} variant="ghost">{job.jobDuration}</Badge> : null}
                {isApplied ? <Badge className={'border-0 bg-emerald-100 text-emerald-700 font-bold'}>Already Applied</Badge> : null}
            </div>

        </div>
    )
}

export default LatestJobCards