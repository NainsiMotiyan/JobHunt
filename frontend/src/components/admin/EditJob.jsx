import React, { useEffect, useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Loader2 } from 'lucide-react';
import axios from 'axios';
import { JOB_API_END_POINT } from '@/utils/constant';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useGetAllCompanies from '@/hooks/useGetAllCompanies';

const EditJob = () => {
    useGetAllCompanies();
    const navigate = useNavigate();
    const { id: jobId } = useParams();
    const { companies } = useSelector((store) => store.company);

    const [input, setInput] = useState({
        title: '',
        description: '',
        requirements: '',
        salary: '',
        jobDuration: '',
        location: '',
        jobType: '',
        experience: '',
        position: '',
        companyId: ''
    });
    const [loading, setLoading] = useState(false);
    const [fetchingJob, setFetchingJob] = useState(false);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const selectChangeHandler = (value) => {
        const selectedCompany = companies.find((company) => company.name.toLowerCase() === value);
        if (selectedCompany) {
            setInput({ ...input, companyId: selectedCompany._id });
        }
    };

    const selectedCompanyName = companies.find((company) => company._id === input.companyId)?.name?.toLowerCase();

    const submitHandler = async (e) => {
        e.preventDefault();
        const parsedPosition = Number(input.position);

        if (Number.isNaN(parsedPosition)) {
            toast.error('Openings must be a valid number.');
            return;
        }

        const payload = {
            ...input,
            title: input.title.trim(),
            description: input.description.trim(),
            requirements: input.requirements.trim(),
            salary: input.salary.trim(),
            jobDuration: input.jobDuration.trim(),
            location: input.location.trim(),
            jobType: input.jobType.trim(),
            experience: input.experience.trim(),
            position: parsedPosition
        };

        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, payload, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate('/admin/jobs');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Failed to update job.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const fetchJob = async () => {
            try {
                setFetchingJob(true);
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    const job = res.data.job;
                    setInput({
                        title: job?.title || '',
                        description: job?.description || '',
                        requirements: Array.isArray(job?.requirements) ? job.requirements.join(', ') : '',
                        salary: job?.salary || '',
                        jobDuration: job?.jobDuration || '',
                        location: job?.location || '',
                        jobType: job?.jobType || '',
                        experience: job?.experienceLevel || '',
                        position: job?.position || '',
                        companyId: job?.company?._id || job?.company || ''
                    });
                }
            } catch (error) {
                toast.error(error?.response?.data?.message || 'Failed to fetch job details.');
            } finally {
                setFetchingJob(false);
            }
        };

        fetchJob();
    }, [jobId]);

    return (
        <div>
            <Navbar />
            <div className='flex items-center justify-center w-screen my-5'>
                <form onSubmit={submitHandler} className='p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md'>
                    <h1 className='font-bold text-xl mb-5'>Edit Job</h1>
                    <div className='grid grid-cols-2 gap-2'>
                        <div>
                            <Label>Position / Title</Label>
                            <Input
                                type='text'
                                name='title'
                                value={input.title}
                                onChange={changeEventHandler}
                                placeholder='Software Engineer Intern'
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input
                                type='text'
                                name='description'
                                value={input.description}
                                onChange={changeEventHandler}
                                placeholder='Initial role as Intern with stipend of Rs 20,000/month'
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input
                                type='text'
                                name='requirements'
                                value={input.requirements}
                                onChange={changeEventHandler}
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Compensation / Stipend</Label>
                            <Input
                                type='text'
                                name='salary'
                                value={input.salary}
                                onChange={changeEventHandler}
                                placeholder='Rs 20,000/month'
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Job Duration</Label>
                            <Input
                                type='text'
                                name='jobDuration'
                                value={input.jobDuration}
                                onChange={changeEventHandler}
                                placeholder='6 months'
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input
                                type='text'
                                name='location'
                                value={input.location}
                                onChange={changeEventHandler}
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input
                                type='text'
                                name='jobType'
                                value={input.jobType}
                                onChange={changeEventHandler}
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input
                                type='text'
                                name='experience'
                                value={input.experience}
                                onChange={changeEventHandler}
                                placeholder='1-2 yr'
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        <div>
                            <Label>Openings</Label>
                            <Input
                                type='number'
                                name='position'
                                value={input.position}
                                onChange={changeEventHandler}
                                className='focus-visible:ring-offset-0 focus-visible:ring-0 my-1'
                            />
                        </div>
                        {companies.length > 0 && (
                            <Select onValueChange={selectChangeHandler} value={selectedCompanyName}>
                                <SelectTrigger className='w-[220px]'>
                                    <SelectValue placeholder='Select a Company' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        {companies.map((company) => (
                                            <SelectItem key={company._id} value={company?.name?.toLowerCase()}>
                                                {company.name}
                                            </SelectItem>
                                        ))}
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    {fetchingJob ? (
                        <Button disabled className='w-full my-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Loading job details
                        </Button>
                    ) : loading ? (
                        <Button disabled className='w-full my-4'>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' /> Updating job
                        </Button>
                    ) : (
                        <Button type='submit' className='w-full my-4'>
                            Update Job
                        </Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditJob;
