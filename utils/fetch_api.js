import { Agent, setGlobalDispatcher } from 'undici';

// using fetchApiRaw instead ...
export async function fetchApi(endpoint, prefix='', unit='', suffix='') {
    try {
        const agent = new Agent({
            connect: {
                rejectUnauthorized: false
            }
        });
    
        setGlobalDispatcher(agent);
    
        const response = await fetch(endpoint, {
            agent: agent,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        return `${prefix} \`${await response.json()}${unit}\` ${suffix}`;
    
    } catch (error) {
        return 'This data is currently unavailable';
    }
}

export async function fetchApiRaw(endpoint) {
    try {
        const agent = new Agent({
            connect: {
                rejectUnauthorized: false
            }
        });
    
        setGlobalDispatcher(agent);
    
        const response = await fetch(endpoint, {
            agent: agent,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        return await response.json();
    
    } catch (error) {
        return undefined;
    }
}