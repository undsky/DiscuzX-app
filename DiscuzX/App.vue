<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	.flex {
		flex: 1;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */

		&-row {
			flex-direction: row;
		}

		&-column {
			flex-direction: column;
		}

		&-justify {
			&-start {
				justify-content: flex-start;
			}

			&-center {
				justify-content: center;
			}

			&-end {
				justify-content: flex-end;
			}

			&-between {
				justify-content: space-between;
			}
		}

		&-align {
			&-start {
				align-items: flex-start;
			}

			&-center {
				align-items: center;
			}

			&-end {
				align-items: flex-end;
			}
		}

		&-wrap {
			&-wrap {
				flex-wrap: wrap;
			}

			&-nowrap {
				flex-wrap: nowrap;
			}
		}
	}
</style>
