/* eslint-disable @typescript-eslint/no-explicit-any */

export const useQueryChart = () => {
    return 'Yey';
};

// SAMPLE CODE BELOW
// import { getUser, getUsersOrganisationByOrgId } from '@admin-app/api/user';
// import { UserDto } from '@dto';
// import { useQuery, useQueryClient } from '@tanstack/react-query';

// const COUNT_PER_PAGE = 10;

// export const useQueryPeople = (orgId: number, page: number) => {
//     const { status, data, isFetching, refetch } = useQuery({
//         queryKey: ['people', orgId, page],
//         queryFn: () => getUsersOrganisationByOrgId(orgId, page * COUNT_PER_PAGE),
//         keepPreviousData: true,
//         refetchOnWindowFocus: false,
//         enabled: !!orgId
//     })

//     // console.log(data);÷
//     const records = data
//         ? data.data
//         : {
//             data: [] as UserDto[],
//             pageCount: 0,
//             itemCount: 0
//         };

//     return { status, records, isFetching, refetch };
// }

// export const useGetPeopleById = (userId: string) => {
//     const id = userId ? parseInt(userId) : '';
//     const { status, data, isFetching } = useQuery({
//         queryKey: ['user', id],
//         queryFn: () => getUser(id as number),
//         enabled: !!id,
//         refetchOnWindowFocus: false,
//         staleTime: 5000
//     })

//     const record = data
//         ? data.data
//         : null;

//     return { status, record, isFetching };
// }

// export const useInvalidateUser = () => {
//     const queryClient = useQueryClient();

//     const invalidate = () => {
//         queryClient.invalidateQueries(['user']);
//     }

//     return { invalidate };
// }
