export const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png","logo.png","world.svg","wrap-svg.cjs","wrapped-svg-file.svg"]),
	mimeTypes: {".png":"image/png",".svg":"image/svg+xml",".cjs":"application/node"},
	_: {
		client: {"start":"_app/immutable/entry/start.DsqP0V1m.js","app":"_app/immutable/entry/app.BMImE9rz.js","imports":["_app/immutable/entry/start.DsqP0V1m.js","_app/immutable/chunks/entry.DjaUnUMU.js","_app/immutable/chunks/scheduler.aZHIKDCl.js","_app/immutable/chunks/index.Haq8omwQ.js","_app/immutable/entry/app.BMImE9rz.js","_app/immutable/chunks/scheduler.aZHIKDCl.js","_app/immutable/chunks/index.Bo1vMjmn.js"],"stylesheets":[],"fonts":[],"uses_env_dynamic_public":false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();
