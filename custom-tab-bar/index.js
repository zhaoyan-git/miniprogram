Component({
	data: {
		active: 0,
		list: [
			{
				icon: {
					normal: 'wap-home-o',
					active: 'wap-home'
				},
				text: '首页',
				url: '/pages/index/index'
			},
			{
				icon: {
					normal: 'warning-o',
					active: 'warning'
				},
				text: '报警',
				url: '/pages/alarm/alarm'
			},
			{
				icon: {
					normal: 'friends-o',
					active: 'friends'
				},
				text: '我的',
				url: '/pages/my/my'
			}
		]
	},

	methods: {
		onChange(event) {
			this.setData({ active: event.detail });
			wx.switchTab({
				url: this.data.list[event.detail].url
			});
		},

		init() {
			const page = getCurrentPages().pop();
			this.setData({
				active: this.data.list.findIndex(item => item.url === `/${page.route}`)
			});
		}
	}
});
