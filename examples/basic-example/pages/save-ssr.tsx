import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, NextPage } from 'next'
import stashy from '@waveplay/stashy'

const SaveSsrPage: NextPage = () => null
export default SaveSsrPage

export const getServerSideProps: GetServerSideProps = async (
	context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<any>> => {
	const { query } = context

	// Save the query into stashy
	Object.keys(query).forEach((key) => {
		// You must pass a "context" for server-side stashy usage
		stashy.set(key, query[key], { context })
	})
	console.log(`Saved query in server side: ${JSON.stringify(query)}`)

	return {
		redirect: {
			destination: '/',
			permanent: true
		}
	}
}
