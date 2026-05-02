import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setAllAppliedJobs, setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import Navbar from './shared/Navbar';
import { BriefcaseBusiness, Building2, CalendarDays, IndianRupee, MapPin, Users, WandSparkles } from 'lucide-react';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';

const JobDescription = () => {
    useGetAppliedJobs();
    const params = useParams();
    const jobId = params.id;
    const {singleJob, allAppliedJobs} = useSelector(store => store.job);
    const {user} = useSelector(store=>store.auth);
    const hasAppliedInApplications = singleJob?.applications?.some((application) => String(application?.applicant) === String(user?._id)) || false;
    const hasAppliedInStore = allAppliedJobs?.some((appliedJob) => appliedJob?.job?._id === jobId) || false;
    const isIntiallyApplied = hasAppliedInApplications || hasAppliedInStore;
    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const positionCount = singleJob?.position || singleJob?.postion || 'Not specified';
    const experienceValue = singleJob?.experienceLevel || singleJob?.experience || 'Not specified';
    const durationValue = singleJob?.jobDuration || 'Not specified';
    const totalApplicants = singleJob?.applications?.length || 0;
    const companyName = singleJob?.company?.name || 'Stealth company';

    const formatCreatedAt = (createdAt) => {
        if (!createdAt) {
            return 'N/A';
        }

        if (typeof createdAt === 'string') {
            return createdAt.split('T')[0];
        }

        const parsedDate = new Date(createdAt);
        return Number.isNaN(parsedDate.getTime()) ? 'N/A' : parsedDate.toISOString().split('T')[0];
    };

    const dispatch = useDispatch();

    useEffect(() => {
        setIsApplied(hasAppliedInApplications || hasAppliedInStore);
    }, [hasAppliedInApplications, hasAppliedInStore]);

    const applyJobHandler = async () => {
        try {
            const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {withCredentials:true});
            
            if(res.data.success){
                setIsApplied(true); // Update the local state
                const updatedSingleJob = {...singleJob, applications:[...(singleJob?.applications || []),{applicant:user?._id}]}
                const updatedAppliedJobs = [...allAppliedJobs, { job: { _id: jobId } }];
                dispatch(setSingleJob(updatedSingleJob)); // helps us to real time UI update
                dispatch(setAllAppliedJobs(updatedAppliedJobs));
                toast.success(res.data.message);

            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    }

    useEffect(()=>{
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`,{withCredentials:true});
                if(res.data.success){
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some((application)=> String(application?.applicant) === String(user?._id))) // Ensure the state is in sync with fetched data
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob(); 
    },[jobId,dispatch, user?._id]);

    return (
        <div className='min-h-screen bg-[radial-gradient(circle_at_top,_rgba(13,148,136,0.16),_transparent_28%),linear-gradient(180deg,_#f7fbfa_0%,_#eef6f3_46%,_#ffffff_100%)]'>
            <Navbar />
            <div className='mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12'>
                <section className='overflow-hidden rounded-[32px] border border-white/60 bg-white/80 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur'>
                    <div className='grid gap-8 lg:grid-cols-[1.5fr_0.9fr]'>
                        <div className='relative p-6 sm:p-8 lg:p-10'>
                            <div className='absolute inset-x-0 top-0 h-28 bg-[linear-gradient(135deg,_rgba(13,148,136,0.18),_rgba(251,191,36,0.16))]' />
                            <div className='relative flex flex-col gap-6'>
                                <div className='flex flex-wrap items-center gap-3'>
                                    <Badge className='rounded-full border-0 bg-teal-100 px-4 py-1 text-teal-800'>Featured opening</Badge>
                                    <Badge className='rounded-full border-0 bg-amber-100 px-4 py-1 text-amber-800'>{singleJob?.jobType || 'Role open'}</Badge>
                                </div>
                                <div className='space-y-3'>
                                    <div className='flex items-center gap-3 text-sm font-medium text-slate-500'>
                                        <Building2 className='h-4 w-4 text-teal-700' />
                                        <span>{companyName}</span>
                                    </div>
                                    <h1 className='max-w-3xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl'>
                                        {singleJob?.title || 'Job opening'}
                                    </h1>
                                    <p className='max-w-2xl text-base leading-7 text-slate-600 sm:text-lg'>
                                        {singleJob?.description || 'This role is live now. Open the details below to review location, compensation, experience, and application status.'}
                                    </p>
                                </div>
                                <div className='flex flex-wrap gap-3'>
                                    <Badge className='rounded-full border-0 bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-800'>
                                        {positionCount} Positions
                                    </Badge>
                                    <Badge className='rounded-full border-0 bg-rose-100 px-4 py-2 text-sm font-semibold text-rose-700'>
                                        {singleJob?.salary || 'Salary on request'}
                                    </Badge>
                                    <Badge className='rounded-full border-0 bg-emerald-100 px-4 py-2 text-sm font-semibold text-emerald-700'>
                                        {singleJob?.location || 'Location TBD'}
                                    </Badge>
                                    {singleJob?.jobDuration ? (
                                        <Badge className='rounded-full border-0 bg-cyan-100 px-4 py-2 text-sm font-semibold text-cyan-700'>
                                            {singleJob.jobDuration}
                                        </Badge>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <aside className='flex flex-col justify-between gap-6 border-t border-slate-200/80 bg-slate-950 px-6 py-6 text-white sm:px-8 lg:border-l lg:border-t-0'>
                            <div className='space-y-4'>
                                <div className='inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200'>
                                    <WandSparkles className='h-4 w-4 text-amber-300' />
                                    Quick overview
                                </div>
                                <div className='grid grid-cols-2 gap-3 text-sm'>
                                    <div className='rounded-2xl bg-white/5 p-4'>
                                        <p className='text-slate-400'>Applicants</p>
                                        <p className='mt-2 text-2xl font-semibold'>{totalApplicants}</p>
                                    </div>
                                    <div className='rounded-2xl bg-white/5 p-4'>
                                        <p className='text-slate-400'>Experience</p>
                                        <p className='mt-2 text-2xl font-semibold'>{experienceValue}</p>
                                    </div>
                                </div>
                                <div className='space-y-3 rounded-3xl border border-white/10 bg-white/5 p-5'>
                                    <div className='flex items-center gap-3'>
                                        <CalendarDays className='h-4 w-4 text-teal-300' />
                                        <div>
                                            <p className='text-xs uppercase tracking-[0.24em] text-slate-400'>Posted</p>
                                            <p className='text-sm font-medium text-white'>{formatCreatedAt(singleJob?.createdAt)}</p>
                                        </div>
                                    </div>
                                    <div className='flex items-center gap-3'>
                                        <BriefcaseBusiness className='h-4 w-4 text-teal-300' />
                                        <div>
                                            <p className='text-xs uppercase tracking-[0.24em] text-slate-400'>Employment</p>
                                            <p className='text-sm font-medium text-white'>{singleJob?.jobType || 'Not specified'}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Button
                                onClick={isApplied ? null : applyJobHandler}
                                disabled={isApplied}
                                className={`h-12 rounded-full text-base font-semibold ${isApplied ? 'bg-white/20 text-white hover:bg-white/20' : 'bg-amber-400 text-slate-950 hover:bg-amber-300'}`}>
                                {isApplied ? 'Already Applied' : 'Apply Now'}
                            </Button>
                        </aside>
                    </div>
                </section>

                <section className='grid gap-6 lg:grid-cols-[1.2fr_0.8fr]'>
                    <div className='rounded-[28px] border border-slate-200 bg-white p-6 shadow-[0_20px_60px_rgba(15,23,42,0.06)] sm:p-8'>
                        <div className='mb-6 flex items-center justify-between gap-4'>
                            <div>
                                <p className='text-sm font-medium uppercase tracking-[0.28em] text-teal-700'>Role details</p>
                                <h2 className='mt-2 text-2xl font-bold text-slate-900'>Job Description</h2>
                            </div>
                            <div className='hidden rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600 sm:block'>
                                Updated for applicants
                            </div>
                        </div>
                        <div className='grid gap-4 sm:grid-cols-2'>
                            <div className='rounded-2xl bg-slate-50 p-5'>
                                <p className='text-sm font-medium text-slate-500'>Role</p>
                                <p className='mt-2 text-base font-semibold text-slate-900'>{singleJob?.title || 'Not specified'}</p>
                            </div>
                            <div className='rounded-2xl bg-slate-50 p-5'>
                                <p className='text-sm font-medium text-slate-500'>Location</p>
                                <p className='mt-2 text-base font-semibold text-slate-900'>{singleJob?.location || 'Not specified'}</p>
                            </div>
                            <div className='rounded-2xl bg-slate-50 p-5 sm:col-span-2'>
                                <p className='text-sm font-medium text-slate-500'>Description</p>
                                <p className='mt-2 text-base leading-7 text-slate-700'>{singleJob?.description || 'No description provided yet.'}</p>
                            </div>
                        </div>
                    </div>

                    <div className='rounded-[28px] border border-teal-100 bg-[linear-gradient(180deg,_#ffffff_0%,_#effcf8_100%)] p-6 shadow-[0_20px_60px_rgba(13,148,136,0.08)] sm:p-8'>
                        <p className='text-sm font-medium uppercase tracking-[0.28em] text-teal-700'>At a glance</p>
                        <div className='mt-6 space-y-4'>
                            <div className='flex items-start gap-4 rounded-2xl bg-white/90 p-4'>
                                <MapPin className='mt-0.5 h-5 w-5 text-teal-700' />
                                <div>
                                    <p className='text-sm text-slate-500'>Work location</p>
                                    <p className='font-semibold text-slate-900'>{singleJob?.location || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-4 rounded-2xl bg-white/90 p-4'>
                                <IndianRupee className='mt-0.5 h-5 w-5 text-teal-700' />
                                <div>
                                    <p className='text-sm text-slate-500'>Compensation</p>
                                    <p className='font-semibold text-slate-900'>{singleJob?.salary || 'Not specified'}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-4 rounded-2xl bg-white/90 p-4'>
                                <BriefcaseBusiness className='mt-0.5 h-5 w-5 text-teal-700' />
                                <div>
                                    <p className='text-sm text-slate-500'>Experience needed</p>
                                    <p className='font-semibold text-slate-900'>{experienceValue}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-4 rounded-2xl bg-white/90 p-4'>
                                <CalendarDays className='mt-0.5 h-5 w-5 text-teal-700' />
                                <div>
                                    <p className='text-sm text-slate-500'>Job duration</p>
                                    <p className='font-semibold text-slate-900'>{durationValue}</p>
                                </div>
                            </div>
                            <div className='flex items-start gap-4 rounded-2xl bg-white/90 p-4'>
                                <Users className='mt-0.5 h-5 w-5 text-teal-700' />
                                <div>
                                    <p className='text-sm text-slate-500'>Open seats</p>
                                    <p className='font-semibold text-slate-900'>{positionCount}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default JobDescription