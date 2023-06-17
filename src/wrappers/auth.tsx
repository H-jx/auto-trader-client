import { Navigate, Outlet, useModel  } from 'umi'
 
export default () => {
    const { initialState, loading, error, refresh, setInitialState } = useModel('@@initialState');

  if (initialState && initialState.name) {
    return <Outlet />;
  } else{
    return <Navigate to={`/login?path=${window.location.pathname}`} />;
  }
}