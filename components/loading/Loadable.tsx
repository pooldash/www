import Skeleton, { SkeletonProps } from 'react-loading-skeleton';

interface Props extends SkeletonProps {
    loading: boolean;
}

export const Loadable: React.FC<Props> = ({ loading, children, ...restProps }) => {
    return loading ? <Skeleton {...restProps} /> : <>{ children }</>;
};