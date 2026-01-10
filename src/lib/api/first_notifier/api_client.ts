import createFetchClient from "openapi-fetch";
import type { paths } from "./first_notifier.api"

const baseUrl = process.env.NEXT_PUBLIC_api_base

const first_notifier_client = createFetchClient<paths>({ baseUrl })

export default first_notifier_client