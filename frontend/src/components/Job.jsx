import React from 'react'
import { Button } from './ui/button'
import { Bookmark } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const Job = ({job}) => {
    const navigate = useNavigate();
    const { allAppliedJobs } = useSelector((store) => store.job);
    const isApplied = allAppliedJobs?.some((appliedJob) => appliedJob?.job?._id === job?._id);
    // const jobId = "lsekdhjgdsnfvsdkjf";

    const daysAgoFunction = (mongodbTime) => {
        if (!mongodbTime) {
            return null;
        }

        const createdAt = new Date(mongodbTime);
        if (Number.isNaN(createdAt.getTime())) {
            return null;
        }

        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference/(1000*24*60*60));
    }

    const daysAgo = daysAgoFunction(job?.createdAt);
    const companyInitial = job?.company?.name?.charAt(0)?.toUpperCase() || 'C';
    
    return (
        <div className='flex h-full min-h-[420px] flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg'>
            <div className='flex items-center justify-between gap-4'>
                <p className='text-sm font-medium text-slate-500'>
                    {daysAgo === null ? 'Recently posted' : daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}
                </p>
                <Button variant="outline" className="rounded-full border-slate-200" size="icon"><Bookmark /></Button>
            </div>

            <div className='my-4 flex items-center gap-3'>
                <Button className="h-14 w-14 rounded-2xl border-slate-200 bg-slate-50 p-0 hover:bg-slate-100" variant="outline" size="icon">
                    <Avatar className='h-10 w-10'>
                        <AvatarImage src={job?.company?.logo} alt={job?.company?.name || 'Company logo'} />
                        <AvatarFallback>{companyInitial}</AvatarFallback>
                    </Avatar>
                </Button>
                <div>
                    <h1 className='text-lg font-semibold text-slate-900'>{job?.company?.name}</h1>
                    <p className='text-sm text-slate-500'>{job?.location || 'India'}</p>
                </div>
            </div>

            <div className='flex-1'>
                <h1 className='mb-2 text-2xl font-bold leading-tight text-slate-900'>{job?.title}</h1>
                <p
                    className='text-sm leading-7 text-slate-600'
                    style={{
                        display: '-webkit-box',
                        WebkitLineClamp: 6,
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
            <div className='mt-5 flex items-center gap-3'>
                <Button onClick={()=> navigate(`/description/${job?._id}`)} variant="outline" className='border-slate-300'>Details</Button>
                <Button className="bg-[#7209b7] hover:bg-[#5f23b7]">Save For Later</Button>
            </div>
        </div>
    )
}

export default Job