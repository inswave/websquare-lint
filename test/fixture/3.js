









































































































































































































			// page function object
			var abcdefg;
			var PageParam = {
				itemCd: "",			// 상품코드
				from: "",			// 목록 Key
				initT0: false,		// TAB 초기화 완료 여부 (Tab0)
			 	initT1: false,		// TAB 초기화 완료 여부 (Tab1)
				today: "",			// 금일	
				b1month: "",		// 1개월
				b3month: "",		// 3개월
				b1year: "",			// 1년
				msg: "스마트 상담센터(1644-3322)로 연락주세요.\n\n● 이용가능 시간은 평일 08:00 ~ 19:30 입니다.\n● 토요일, 일요일 및 공휴일에는 상담서비스를 제공하지 않습니다.",
				colorArr: ["ffd66a", "f88844", "88cb1f", "247fe4", "14559c", "ef82a9", "b55bdf", "1ec4ed", "e75264", "5c900b", "55748c", "9b6d0b", "df4993", "c7cbce"]
			};
			
			// page function object
		    var PageFunc = {};
		    
		    // 초기화
		    PageFunc.fn_init = function() {
		    debugger;
		    	 abcdefg1 = {};
		    	PageParam.itemCd = WebSquare.net.getParameter("itemCd");
		    	PageParam.from   = WebSquare.net.getParameter("from");
		    	PageParam.tabIndex = WebSquare.net.getParameter("tabIndex");
		    	if (PageParam.from == "")
		    		PageParam.from = "mkt3001m01";	// 랭킹펀드
		    	
		    	// 날짜 기본정보
		    	PageParam.today   = dwsDate.getCurrentDate();
		    	PageParam.b1month = WebSquare.date.dateAdd(PageParam.today, -30);
		    	PageParam.b3month = WebSquare.date.dateAdd(PageParam.today, -90);
		    	PageParam.b1year  = WebSquare.date.dateAdd(PageParam.today, -365);
		    		
		    	// 임시 
		    	//tab_main.setSelectedTabIndex(1);
		    	
		    	// 설명보기('?'아이콘) 팝업 처리
		    	$("#wrap").click(function(event) {
		    		var currElement = $(event.target);
		    		var curId = currElement.attr("id");
		    		if (curId == "img_question0" || curId == "img_question1" || curId == "img_question2" ||
						curId == "grp_toolTip0"  || curId == "grp_toolTip1"  || curId == "grp_toolTip2"  ||
						curId == "wrap")
						return;
		    		
					var objParent = currElement.parent();
					var parentId  = objParent.attr("id"); 
					
					while (parentId != "wrap" && objParent != null) {
						if (parentId == "grp_toolTip0" || parentId == "grp_toolTip1" || parentId == "grp_toolTip2" || curId == "wrap")
							return;
						objParent = objParent.parent();
						parentId  = objParent.attr("id"); 
					} 
					
					PageFunc.fn_showTooltip("");
		    	});
		    			    	
   			    // 펀드정보 처리
		    	PageFunc.fn_selectDetailT0();
		    };
		    
		    // 펀드 상세 조회 (Tab0)
		    PageFunc.fn_selectDetailT0 = function() {
		    	// 조회조건 설정	
		    	dc_selectDetail.set("itemCd", PageParam.itemCd);				// 상품코드 
		    	
		    	// 조회 시작
		    	DWSAjax.post("/mkt/mkt3/mkt3001j04/selectDetailT0.do", dc_selectDetail.getJSON(), function(response) {
		    		// 조회 후 후처리
		    		PageFunc.fn_callBack("selectDetailT0", response);
		        });
		    };
		    
		    // 펀드 상세 조회 (Tab1)
		    PageFunc.fn_selectDetailT1 = function() {
		    	// 조회조건 설정	
		    	dc_selectDetail.set("itemCd", PageParam.itemCd);				// 상품코드 
		    	dc_selectDetail.set("fundCd", dc_detailInfoMap.get("FUND_CD"));	// 펀드코드
		    	
		    	// 조회 시작
		    	DWSAjax.post("/mkt/mkt3/mkt3001j04/selectDetailT1.do", dc_selectDetail.getJSON(), function(response) {
		    		// 조회 후 후처리
		    		PageFunc.fn_callBack("selectDetailT1", response);
		        });
		    };
		    
		    // 동일 유형내 수익률 상위 펀드 목록 조회
		    PageFunc.fn_selectTop3SuikRT = function(term) {
		    	DWSAjax.post("/mkt/mkt3/mkt3001j04/selectTop3SuikRT.do", {
		    			fundCd: dc_detailInfoMap.get("FUND_CD"),
		    			term: term
		    		}, 
		    		function(response) {
			    		PageFunc.fn_callBack("selectTop3SuikRT", response);
			        });
		    };
		    
		    // 이 펀드를 조회한 고객님들이 본 상위펀드 목록 조회
		    PageFunc.fn_selectTop3Fvr = function() {
		    	DWSAjax.post("/mkt/mkt3/mkt3001j04/selectTop3Fvr.do", {
		    			itemCd: PageParam.itemCd
		    		}, 
		    		function(response) {
			    		PageFunc.fn_callBack("selectTop3Fvr", response);
			        });
		    };
		    
		    // 로그인 후처리 정보 조회
		    PageFunc.fn_selectAfterLoginInfo = function() {
		    	DWSAjax.post("/mkt/mkt3/mkt3001j04/selectAfterLoginInfo.do", {
		    			dummy: "DUMMY"
		    		}, 
		    		function(response) {
			    		PageFunc.fn_callBack("selectAfterLoginInfo", response);
			        });
		    };
		    
		    // [최근 3개월 수익률 추이] 차트 데이터 조회
		    PageFunc.fn_yirt3ChartDateT0 = function() {
		    	// 차트 컨트롤에 전달할 JSON 개체
		    	var chartJson = {
		        	chart: {},
		        	categories: [ 
		        		{ category: [] } 
		        	],
		        	dataset: []
		        };
		        
		        // 날짜 구간 조회
		        DWSAjax.post("/mkt/mkt3/mkt3001p01/selectCompareChartDates.do", { 
		        		from: PageParam.b3month, 
		        		to: PageParam.today,
		        		mode: "mm-dd" 
		        	}, 
		        	function(response) {
			    		PageFunc.fn_callBackChart("yirt3_dates", response, chartJson);
			        });
			        
			    // 수익률 데이터 설정
				DWSAjax.post("/mkt/mkt3/mkt3001p01/selectCompareChartInfo.do", { 
	    				itemCd: PageParam.itemCd, 
	    				itemNm: "",
	    				from: PageParam.b3month, 
	    				to: PageParam.today 
	    			}, 
		        	function(response) {
			    		PageFunc.fn_callBackChart("yirt3_data", response, chartJson);
		        	});
		    };
		    
		    // [펀드규모 추이] 차트 데이터 조회
		    PageFunc.fn_otxtChartDateT0 = function() {
		    	// 차트 컨트롤에 전달할 JSON 개체
		    	var chartJson = {
		        	chart: {},
		        	categories: [ 
		        		{ category: [] } 
		        	],
		        	dataset: []
		        };
		        
		        // 날짜 구간 조회
		        DWSAjax.post("/mkt/mkt3/mkt3001p01/selectCompareChartDates.do", { 
		        		from: PageParam.b1year, 
		        		to: PageParam.today,
		        		mode: "mm-dd" 
		        	}, 
		        	function(response) {
			    		PageFunc.fn_callBackChart("otxt_dates", response, chartJson);
			        });
			        
			    // 펀드규모 데이터 설정
				DWSAjax.post("/mkt/mkt3/mkt3001p01/selectOtxtAmtInfo.do", { 
	    				itemCd: PageParam.itemCd, 
	    				itemNm: "",
	    				from: PageParam.b1year, 
	    				to: PageParam.today 
	    			}, 
		        	function(response) {
			    		PageFunc.fn_callBackChart("otxt_data", response, chartJson);
		        	});
		    };
		    
		    // [수익률 추이] 차트 데이터 조회
		    PageFunc.fn_yirtChartDateT1 = function(startDate) {
		    	// 차트 컨트롤에 전달할 JSON 개체
		    	var chartJson = {
		        	chart: {},
		        	categories: [ 
		        		{ category: [] } 
		        	],
		        	dataset: []
		        };
		        
		        // 날짜 구간 조회
		        DWSAjax.post("/mkt/mkt3/mkt3001p01/selectCompareChartDates.do", { 
		        		from: startDate, 
		        		to: PageParam.today,
		        		mode: "yyyy-mm-dd"
		        	}, 
		        	function(response) {
			    		PageFunc.fn_callBackChart("yirt_dates", response, chartJson);
			        });
			        
			    // 수익률 데이터 설정
				DWSAjax.post("/mkt/mkt3/mkt3001p01/selectCompareChartInfo.do", { 
	    				itemCd: PageParam.itemCd, 
	    				itemNm: txt_ITEM_NAME.getValue(),
	    				from: startDate, 
	    				to: PageParam.today 
	    			}, 
		        	function(response) {
			    		PageFunc.fn_callBackChart("yirt_data", response, chartJson);
		        	});
		    };
		    
		    // 차트 데이터 조회 (지수)
		    PageFunc.fn_selectChartSubInfoT1 = function(index, key, checked) {
		    	var label		 = cbx_chart_T1.itemArr[index].label;		// 코스피, 코스닥, DOWJONES, NASDAQH, (홍콩)지수
		    	var chartJson	 = charYirt_T1.fc().getJSONData();		// 기존 차트의 JSON 데이터
		    	var anchorradius = btn_fc1Month_T1.hasClass("on") ? "3" : "2";
		    	
		    	if (checked) {
		    		// 체크 추가 시: 서버에서 데이터를 가져와서 차트에 추가한다.
		    		DWSAjax.post("/mkt/mkt3/mkt3001p01/selectChartSubInfo.do", 
						{
							key: key,
							baseDate: PageParam.today,
							dataCount: chartJson.categories[0].category.length.toString()
						}, 
		        		function(response) {
		        			chartJson.dataset.push({
			        			seriesname: label,
			        			anchorradius: anchorradius,
			        			color: PageParam.colorArr[parseInt(index, 10) + 3],
			        			dashed: "1",
			        			linedashlen: "15",
			        			linedashgap: "2",
			        			data: []
			        		});
			    			chartJson.dataset[chartJson.dataset.length - 1].data = response.dc_chartSubInfoList;
			    			charYirt_T1.fc().setJSONData(chartJson);
		        		});
		    	} else {
		    		// 체크 해제 시: 차트 데이터에서 해당 데이터를 제거한다.
		    		var newDataset = [];
		    		var count = chartJson.dataset.length;
		    		for (var i = 0; i < count; i++) {
		    			if (chartJson.dataset[i].seriesname != label) {
		    				newDataset.push(chartJson.dataset[i]);
		    			} 
		    		}
		    		chartJson.dataset = newDataset;
		    		charYirt_T1.fc().setJSONData(chartJson);
		    	}
		    };
		    
		    // 조회 후 후처리
		    PageFunc.fn_callBack = function(val, response) {
		    	switch (val) {
		    		case "selectDetailT0":				// 조회 (Tab0)
		    			// 종목코드, 펀드코드, 기준가일자
		    			var ITEM_CD		= dc_detailInfoMap.get("ITEM_CD");
		    			var FUND_CD		= dc_detailInfoMap.get("FUND_CD");
		    			var BSPR_DATE	= dc_detailInfoMap.get("BSPR_DATE");
		    			var ITEM_NM		= dc_detailInfoMap.get("ITEM_NM");
		    			
		    			// ********** [기본영역] **********
		    			
		    			// 종목명
		    			txt_ITEM_NAME.setValue(ITEM_NM);
		    			document.title = ITEM_NM + " - KDB대우증권";
		    									
		    			// 추천펀드여부
		    			if (dc_detailInfoMap.get("RCMD_FUND_YN") == "Y") {
		    				img_RCMD_FUND_YN.show("");
		    			}
		    			// 3개월수익율
		    			txt_MMS3_YIRT.setValue(dc_detailInfoMap.get("MMS3_YIRT"));
		    			txt_MMS3_YIRT.addClass(parseFloat(dc_detailInfoMap.get("MMS3_YIRT")) > 0 ? 'high' : (parseFloat(dc_detailInfoMap.get("MMS3_YIRT")) < 0 ? 'low' : ''));
		    			
		    			// 운용속성명
		    			txt_OPR_ATTR_NM.setValue(dc_detailInfoMap.get("OPR_ATTR_NM"));

						// 투자위험도등급코드
						var IVST_RISK_DEG_GRAD_CD	= dc_detailInfoMap.get("IVST_RISK_DEG_GRAD_CD");
						var IVST_RISK_DEG_GRAD_NM	= dc_detailInfoMap.get("IVST_RISK_DEG_GRAD_NM");
						var riskClass				= "";
		    			var riskGrade				= "";
					    if (IVST_RISK_DEG_GRAD_CD == "05" || IVST_RISK_DEG_GRAD_CD == "5" || IVST_RISK_DEG_GRAD_CD == "V") {		// 초저위험
					    	riskClass = "bg31";
		    				riskGrade = "1";
		    			} else if (IVST_RISK_DEG_GRAD_CD == "04" || IVST_RISK_DEG_GRAD_CD == "4" || IVST_RISK_DEG_GRAD_CD == "W") {	// 저위험
		    				riskClass = "bg32";
		    				riskGrade = "2";	
		    			} else if (IVST_RISK_DEG_GRAD_CD == "03" || IVST_RISK_DEG_GRAD_CD == "3" || IVST_RISK_DEG_GRAD_CD == "X") {	// 중위험
		    				riskClass = "bg32";
		    				riskGrade = "3";	
		    			} else if (IVST_RISK_DEG_GRAD_CD == "02" || IVST_RISK_DEG_GRAD_CD == "2" || IVST_RISK_DEG_GRAD_CD == "Y") {	// 고위험
		    				riskClass = "bg33";
		    				riskGrade = "4";
		    			} else if (IVST_RISK_DEG_GRAD_CD == "01" || IVST_RISK_DEG_GRAD_CD == "1" || IVST_RISK_DEG_GRAD_CD == "Z") {	// 초고위험
		    				riskClass = "bg33";
		    				riskGrade = "5";
		    			}
					    txt_IVST_RISK_DEG_GRAD_NM.setValue(IVST_RISK_DEG_GRAD_NM);
					    txt_IVST_RISK_DEG_GRAD_NM.addClass(riskClass);
					    
					    // 펀드설정원본금액
					    txt_FUND_SET_OTXT_AMT.setValue((Math.floor((parseFloat(dc_detailInfoMap.get("FUND_SET_OTXT_AMT"))  / 100000000) * 100) / 100));
					    
					    // 기준가일자
					    txt_BSPR_DATE.setValue(BSPR_DATE);
					    
					    // 기본정보				
					    txt_OPRC_IFNM.setValue(dc_detailInfoMap.get("OPRC_IFNM"));					// 운용사약어명
					    txt_TRD_BSPR.setValue(dc_detailInfoMap.get("TRD_BSPR"));					// 매매기준가
					    var YDAY_CMPR_YIRT = parseFloat(dc_detailInfoMap.get("YDAY_CMPR_YIRT"));	// 전일대비수익률
					    
					    txt_YDAY_CMPR_YIRT.setValue((YDAY_CMPR_YIRT > 0 ? "▲" : "▼") + (Math.floor(YDAY_CMPR_YIRT * 100) / 100));
					    txt_YDAY_CMPR_YIRT.addClass((YDAY_CMPR_YIRT > 0) ? "high" : "low");
					    txt_IVST_ZONE_NM.setValue(dc_detailInfoMap.get("IVST_ZONE_NM"));			// 투자지역명
					    var TOT_FEE_RATE = parseFloat(dc_detailInfoMap.get("TOT_FEE_RATE"));		// 총보수율
					    txt_TOT_FEE_RATE.setValue("연 " + (Math.floor(TOT_FEE_RATE * 100) / 100).formatByComma() + "%");
					    txt_SET_DATE.setValue(dc_detailInfoMap.get("SET_DATE"));					// 설정일자
					    
					    // PDF 다운로드
					    btn_PDF1.setUserData("ITEM_CD", ITEM_CD);
					    btn_PDF2.setUserData("ITEM_CD", ITEM_CD);
					    btn_PDF3.setUserData("ITEM_CD", ITEM_CD);
					    btn_PDF5.setUserData("ITEM_CD", ITEM_CD);
					    
					    // ********** [쉬운설명] **********
					    
					    // [투자유형] 투자지역
					    txt_IVST_ZONE_NM_T0.setValue("투자지역 : " + dc_detailInfoMap.get("IVST_ZONE_NM"));
					    
					    // [투자유형] 주요투자대상
					    var tmp_STOCK_RT = parseFloat(dc_mainIvstTgt.get("STOCK_RT"));
					    var tmp_BOND_RT	 = parseFloat(dc_mainIvstTgt.get("BOND_RT"));
					    var tmp_FUND_RT	 = parseFloat(dc_mainIvstTgt.get("FUND_RT"));
					    var tmp_CASH_RT	 = parseFloat(dc_mainIvstTgt.get("CASH_RT"));
					    var tmp_GITA_RT	 = parseFloat(dc_mainIvstTgt.get("GITA_RT"));
					    var MAX_RT		 = 0;
					    var MAX_DESC	 = "";
					    
					    if (tmp_STOCK_RT > MAX_RT) {
					    	MAX_RT	 = tmp_STOCK_RT;
					    	MAX_DESC = "주식";
					    }
					    
					    if (tmp_BOND_RT > MAX_RT) {
					    	MAX_RT	 = tmp_BOND_RT;
					    	MAX_DESC = "채권";
					    }
					    
					    if (tmp_FUND_RT > MAX_RT) {
					    	MAX_RT	 = tmp_FUND_RT;
					    	MAX_DESC = "펀드";
					    }
					    
					    if (tmp_CASH_RT > MAX_RT) {
					    	MAX_RT	 = tmp_CASH_RT;
					    	MAX_DESC = "유동성";
					    }
					    
					    if (tmp_GITA_RT > MAX_RT) {
					    	MAX_RT	 = tmp_GITA_RT;
					    	MAX_DESC = "기타";
					    }
					    
					    txt_MAIN_IVST_TGT_T0.setValue("주요투자대상 : " + MAX_DESC + " (" + (Math.floor(MAX_RT * 100) / 100).formatByComma() + "%)");
					    
					    // [투자유형] 운용사
					    var WEB_URL = dc_detailInfoMap.get("WEB_URL").trim();
					    if (WEB_URL == "") {
					    	txt_OPRC_IFNM_T0.setValue("운용사 : " + dc_detailInfoMap.get("OPRC_IFNM"));
					    } else {
					    	if (WEB_URL.indexOf("http://") < 0 || WEB_URL.indexOf("https://"))
					    		WEB_URL = "http://" + WEB_URL;
					    	txt_OPRC_IFNM_T0.setValue("운용사 : <a href=\"" + WEB_URL + "\" target=\"_blank\">" + dc_detailInfoMap.get("OPRC_IFNM") + "</a>");
					    }
					    
					    // [투자유형] 이미지
					    txt_ZEROIN_TYPE_LNM_T0.setValue(dc_detailInfoMap.get("ZEROIN_TYPE_LNM"));
					    txt_ZEROIN_TYPE_NM_T0.setValue(dc_detailInfoMap.get("ZEROIN_TYPE_NM"));
					    var ZEROIN_TYPE_LCD = dc_detailInfoMap.get("ZEROIN_TYPE_LCD");
					    if (ZEROIN_TYPE_LCD == "11") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type5");	// MMF
					    } else if (ZEROIN_TYPE_LCD == "24" || ZEROIN_TYPE_LCD == "64") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type9");	// 부동산형
					    } else if (ZEROIN_TYPE_LCD == "23") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type8");	// 절대수익추구형
					    } else if (ZEROIN_TYPE_LCD == "20" || ZEROIN_TYPE_LCD == "60") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type1");	// 주식형
					    } else if (ZEROIN_TYPE_LCD == "21" || ZEROIN_TYPE_LCD == "61") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type2");	// 주식혼합형
					    } else if (ZEROIN_TYPE_LCD == "10" || ZEROIN_TYPE_LCD == "50") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type4");	// 채권형
					    } else if (ZEROIN_TYPE_LCD == "22" || ZEROIN_TYPE_LCD == "62") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type3");	// 채권혼합형
					    } else if (ZEROIN_TYPE_LCD == "65") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type6");	// 커머더티형
					    } else if (ZEROIN_TYPE_LCD == "29" || ZEROIN_TYPE_LCD == "69") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type10");	// 기타
					    } else if (ZEROIN_TYPE_LCD == "63") {				
					    	txt_ZEROIN_TYPE_LNM_T0.addClass("type7");	// 멀티에셋형
					    }
					    
					    // [투자위험] 위험등급 
					    var RISK_KEY = PageFunc.fn_riskKey(IVST_RISK_DEG_GRAD_CD);
					    RISK_IMG_T0.setSrc("/dws/images/inc/icon_grade_01_" + RISK_KEY + ".png");
					    RISK_IMG_T0.setAlt(IVST_RISK_DEG_GRAD_NM);
					    txt_IVST_RISK_DEG_GRAD_NM_T0.setValue(IVST_RISK_DEG_GRAD_NM);
					    txt_IVST_RISK_DEG_GRAD_NM_T0.addClass("tt_dg_" + RISK_KEY);
					    txt_IVST_RISK_DEG_GRAD_T0.setValue(" (" + riskGrade + "등급) 상품입니다.");
					    
					    // [투자위험] 표준편차 
					    var YY_DEV = dc_detailInfoMap.get("YY_DEV");
					    if (YY_DEV == "")
					    	YY_DEV = "-";
					    else 
					    	YY_DEV = (Math.floor(parseFloat(YY_DEV) * 100) / 100).formatByComma() + "%";
					    txt_YY_DEV_T0.setValue(YY_DEV);
					    
					    // [투자위험] 로그인 여부에 따른 투자성향 처리
						if (response.userName == "") {
							txt_cPatternNm_T0.setValue("고객님의 투자성향 : ");
							txt_cPatternTy_T0.setValue("[비로그인 중]");
							btn_cPattern_T0.setValue("로그인");
							btn_cPattern_T0.setUserData("type", "login");
							
							btn_concern.setUserData("type", "login");
							btn_concern2.setUserData("type", "login");
						} else {
							txt_cPatternNm_T0.setValue(response.userName + "님의 투자성향 : ");
							DWSAjax.post("/mkm/main/selectCustInfo.do", null, function(response) {
								txt_cPatternTy_T0.setValue(response.dc_a11oia5Data.o_IvstTrndClas);
							});
							btn_cPattern_T0.setValue("변경");
							btn_cPattern_T0.setUserData("type", "change");
							
							btn_concern.setUserData("type", "regist");
							btn_concern2.setUserData("type", "regist");
						}
						
						// [구매방법] 임의식, 적립식
						var SPCL_FRM_SECT = dc_detailInfoMap.get("SPCL_FRM_SECT");
						if (SPCL_FRM_SECT == "12") {
							SPCL_FRM_SECT = "적립식";
						} else {
							SPCL_FRM_SECT = "임의식, 적립식";
						}
						txt_SPCL_FRM_SECT_T0.setValue("이 상품은 <span class=\"point\">" + SPCL_FRM_SECT + "</span>으로 투자가 가능한 상품입니다.");
						
						// [구매방법] 온라인구매, 지점구매
						var ONLN_BUY_ENBL_YN = dc_detailInfoMap.get("ONLN_BUY_ENBL_YN");
						var BUY_ENBL_TYPE	 = "";
						
						if (ONLN_BUY_ENBL_YN == "Y") {
							BUY_ENBL_TYPE = "온라인구매";
						} else {
							BUY_ENBL_TYPE = "지점구매";
							btn_buyTop.setDisabled(true);
							btn_buyBottom.hide();
						}
						txt_BUY_ENBL_TYPE_T0.setValue("상품구매는 <span class=\"point\">" + BUY_ENBL_TYPE + "</span>가 가능한 상품입니다.");
																							
						// [구매방법] 보수    
						txt_TOT_FEE_RATE_T0.setValue("연 " + (Math.floor(TOT_FEE_RATE * 100) / 100).formatByComma() + "%");
						
					    // [구매방법, 수수료/보수율 안내] 선취수수료
					    var rowCount = dc_panMaeBeforeList.getRowCount();
					    if (rowCount > 0) {
					    	var LEVY_GB = dc_panMaeBeforeList.getCellData(0, "LEVY_GB").trim();
					    	if (LEVY_GB == "")
					    		LEVY_GB = "";
					    	txt_PANMAEBEFORE_T0.setValue(LEVY_GB + dc_panMaeBeforeList.getCellData(0, "FEE_RT_AMT"));
					    	txt_PANMAEBEFORE_T1.setValue(LEVY_GB + dc_panMaeBeforeList.getCellData(0, "FEE_RT_AMT"));
					    } else {
					    	txt_PANMAEBEFORE_T0.setValue("없음");
					    	txt_PANMAEBEFORE_T1.setValue("없음");
					    }
					    
					    // [구매방법, 수수료/보수율 안내] 환매수수료, 환매제한기간
					    var HWANMAE		 = "";
					    var HWANMAEGIGAN = "";
					    var HWANMAEFEE1	 = "";
					    var rowCount = dc_hwanMaeList.getRowCount();
					    for (var i = 0; i < rowCount; i++) {
					    	var LEVY_GB		 = dc_hwanMaeList.getCellData(i, "LEVY_GB"); 
					    	var TERM_UNIT_CD = dc_hwanMaeList.getCellData(i, "TERM_UNIT_CD");
					    	var FEE_RT_AMT	 = dc_hwanMaeList.getCellData(i, "FEE_RT_AMT");
					    	HWANMAE		 += "<br/>" + LEVY_GB + " " + TERM_UNIT_CD + " " + FEE_RT_AMT;
					    	HWANMAEGIGAN += "<br/>" + TERM_UNIT_CD;
					    	HWANMAEFEE1	 += "<br/>" + LEVY_GB + " " + FEE_RT_AMT;
					    }
					    if (HWANMAE.length > 5)
					    	HWANMAE = HWANMAE.substr(5);
					    txt_HWANMAE_T0.setValue(HWANMAE);
					    
					    if (HWANMAEGIGAN.length > 5)
					    	HWANMAEGIGAN = HWANMAEGIGAN.substr(5);
					    txt_HWANMAE_T1.setValue(HWANMAEGIGAN);
					    
					    if (HWANMAEFEE1.length > 5)
					    	HWANMAEFEE1 = HWANMAEFEE1.substr(5);
					    txt_HWANMAEFEE1_T1.setValue(HWANMAEFEE1);
					    
					    // [최근 3개월 수익률 추이] 기준일자
						txt_BSPR_DATE_1_T0.setValue(BSPR_DATE);
						
						// [최근 3개월 수익률 추이] 3개월투자성과 수익율
						txt_MMS3_YIRT_T0.setValue(dc_detailInfoMap.get("MMS3_YIRT"));
						
						// [펀드규모 추이] 기준일자
						txt_BSPR_DATE_2_T0.setValue(BSPR_DATE);
						
						// [펀드규모 추이] 증감률
						var FUND_SET_OTXT_AMT	= parseFloat(dc_detailInfoMap.get("FUND_SET_OTXT_AMT"));	// 펀드설정원본금액
						var STPT_IND 			= parseFloat(dc_detailInfoMap.get("STPT_IND"));				// 설정액증감
						var STPT_IND_DESC		= ""; 
						if (STPT_IND < 0) {
							STPT_IND_DESC = "% 감소";
						} else {
							STPT_IND_DESC = "% 증가";
						}
						var STPT_IND_RT = (Math.floor((STPT_IND / FUND_SET_OTXT_AMT * 100) * 100) / 100).formatByComma();
						
						txt_STPT_IND_T0.setValue((Math.floor(((FUND_SET_OTXT_AMT + STPT_IND) / 100000000) * 100) / 100).formatByComma() + "억원");
						
						txt_STPT_IND_RT_T0.setValue(STPT_IND_RT + STPT_IND_DESC);
						
						// ********** [상세정보] **********
					    
					    var LATETRDN_BASE_TIME			= dc_detailInfoMap.get("LATETRDN_BASE_TIME");
					    var BASE_TIME_BEF_BUY_DCNT		= dc_detailInfoMap.get("BASE_TIME_BEF_BUY_DCNT");
					    var BASE_TIME_AFT_BUY_DCNT		= dc_detailInfoMap.get("BASE_TIME_AFT_BUY_DCNT");
					    var BASE_TIME_AFT_REP_BSPR_DCNT	= dc_detailInfoMap.get("BASE_TIME_AFT_REP_BSPR_DCNT");
					    var BASE_TIME_BEF_REP_DCNT		= dc_detailInfoMap.get("BASE_TIME_BEF_REP_DCNT");
					    var BASE_TIME_AFT_BUY_DCNT		= dc_detailInfoMap.get("BASE_TIME_AFT_BUY_DCNT");
					    
					    // [펀드 상세내용] 투자지역/투자유형
					    txt_IVST_ZONE_OPR_ATTR_NM_T1.setValue(dc_detailInfoMap.get("IVST_ZONE_NM") + "/" + dc_detailInfoMap.get("OPR_ATTR_NM"));
					    
					    // [펀드 상세내용] 입금:가격적용일, 입금:매입일
					    txt_BASE_TIME_BEF_BUY_DCNT1_T1.setValue(LATETRDN_BASE_TIME + "시이전 " + BASE_TIME_BEF_BUY_DCNT + "일 (" + LATETRDN_BASE_TIME + "시이후 " + BASE_TIME_AFT_BUY_DCNT + "일)");
					    txt_BASE_TIME_BEF_BUY_DCNT2_T1.setValue(LATETRDN_BASE_TIME + "시이전 " + BASE_TIME_BEF_BUY_DCNT + "일 (" + LATETRDN_BASE_TIME + "시이후 " + BASE_TIME_AFT_BUY_DCNT + "일)");
					    
					    // [펀드 상세내용] 환매:가격적용일, 환매:출금일
					    txt_BASE_TIME_AFT_BUY_DCNT1_T1.setValue(LATETRDN_BASE_TIME + "시이전 " + BASE_TIME_AFT_REP_BSPR_DCNT + "일 (" + LATETRDN_BASE_TIME + "시이후 " + BASE_TIME_AFT_REP_BSPR_DCNT + "일)");
					    txt_BASE_TIME_AFT_BUY_DCNT2_T1.setValue(LATETRDN_BASE_TIME + "시이전 " + BASE_TIME_BEF_REP_DCNT      + "일 (" + LATETRDN_BASE_TIME + "시이후 " + BASE_TIME_AFT_BUY_DCNT + "일)");
					    
					    // [보수율 및 대금지급 기준] 환매대금 지급일수, 환매기준가 적용일수
					    txt_BASE_TIME_AFT_BUY_DCNT1_T0.setValue(LATETRDN_BASE_TIME + "시이전 " + BASE_TIME_AFT_REP_BSPR_DCNT + "일 (" + LATETRDN_BASE_TIME + "시이후 " + BASE_TIME_AFT_REP_BSPR_DCNT + "일)");
					    txt_BASE_TIME_AFT_BUY_DCNT2_T0.setValue(LATETRDN_BASE_TIME + "시이전 " + BASE_TIME_BEF_REP_DCNT      + "일 (" + LATETRDN_BASE_TIME + "시이후 " + BASE_TIME_AFT_BUY_DCNT + "일)");
					    
						// 오늘 본 상품 등록 (펀드)
						var rvGoods = {
							itemType : "03",
							itemCode : PageParam.itemCd,
							itemName : ITEM_NM,
							marketGb : dc_detailInfoMap.get("OPR_ATTR_NM")
						};
						RecentGoods.setGoods(rvGoods);
						
						// ********** [차트정보] **********
						
				    	PageFunc.fn_yirt3ChartDateT0();					// [최근 3개월 수익률 추이] 차트 데이터 조회
						PageFunc.fn_otxtChartDateT0();					// [펀드규모 추이] 차트 데이터 조회
						
						// ********** [하단정보] **********
						
						PageFunc.fn_selectTop3SuikRT("3");				// 동일 유형내 수익률 상위 펀드 목록 조회
		    			PageFunc.fn_selectTop3Fvr();					// 이 펀드를 조회한 고객님들이 본 상위펀드 목록 조회
						break;
		    			
		    		case "selectDetailT1":				// 조회 (Tab1)
		    		
		    			// ********** [상세정보] **********
		    			
		    			// [펀드 상세내용, 수수료/보수율 안내] 수탁사
					  	var rowCount = dc_feeRTList.getRowCount();
					    for (var i = 0; i < rowCount; i ++) {
					    	var FEE_CD = dc_feeRTList.getCellData(i, "FEE_CD");	// 보수종류코드
					    	var FEE_RT = dc_feeRTList.getCellData(i, "FEE_RT");	// 보수율
					    	var ORG_NM = dc_feeRTList.getCellData(i, "ORG_NM");
					    	
					    	if (FEE_CD == "FA01") {			// 사무보수
					    		txt_SAMUFEE_T1.setValue(FEE_RT);
					    	} else if (FEE_CD == "FA02") {	// 수탁보수, 수탁사
					    		txt_SUTAKEFEE_T1.setValue(FEE_RT);
					    		txt_SUTAKCOMPANY_T1.setValue(ORG_NM);
					    	} else if (FEE_CD == "FA04") {	// 판매보수
					    		txt_PANMAEFEE_T1.setValue(FEE_RT);
					    	} else if (FEE_CD == "FA05") {	// 운용보수
					    		txt_UNYOUNGFEE_T1.setValue(FEE_RT);
					    	} else if (FEE_CD == "FA10") {	// 총보수
					    		txt_TOTALFEE_T1.setValue(FEE_RT);
					    	}
					    }
					    
					    // [동일유형 내 수익률 비교] 펀드, 벤치마크
					    var keys = [1, 3, 6, 12, 36];
					    var SUIK_GIJUN_YMD = "";
					    
					    for (var i = 0; i < keys.length; i++) {
					    	eval("txt_SILH_SUIK_RT_" + keys[i] + "_T1").setValue("-");
					    	eval("txt_BM_SUIK_RT_" + keys[i] + "_T1").setValue("-");
					    	eval("txt_TYPE_AVG_" + keys[i] + "_T1").setValue("-");
					    	eval("txt_GIGAN_SUIK_RANK2_" + keys[i] + "_T1").setValue("-");
					    }
					    
					    var rowCount = dc_giganFundSuikList.getRowCount();
					    for (var i = 0; i < rowCount; i ++) {
					    	var TERM	 		 = dc_giganFundSuikList.getCellData(i, "TERM");
					    	var GIJUN_YMD		 = dc_giganFundSuikList.getCellData(i, "GIJUN_YMD");
					    	var GIGAN_SUIK_RANK2 = parseFloat(dc_giganFundSuikList.getCellData(i, "GIGAN_SUIK_RANK2"));
					    	
					    	if (SUIK_GIJUN_YMD == "" && GIJUN_YMD != "")
					    		SUIK_GIJUN_YMD = GIJUN_YMD;
					    	
					    	var SUIK_RANK2_DESC = "보통";
					    	var SUIK_RANK2_KEY  = "02";
					    	if (GIGAN_SUIK_RANK2 > 0 && GIGAN_SUIK_RANK2 <= 33.3) {
					    		SUIK_RANK2_DESC = "양호";
					    		SUIK_RANK2_KEY  = "01";
					    	} else if (GIGAN_SUIK_RANK2 > 33.3 && GIGAN_SUIK_RANK2 <= 66.6) {
					    		SUIK_RANK2_DESC = "보통";
					    		SUIK_RANK2_KEY  = "02";
					    	} else if (GIGAN_SUIK_RANK2 > 66.6) {
					    		SUIK_RANK2_DESC = "나쁨";
					    		SUIK_RANK2_KEY  = "03";
					    	}
					    	eval("txt_GIGAN_SUIK_RANK2_" + TERM + "_T1").setValue(SUIK_RANK2_DESC);
					    	eval("img_GIGAN_SUIK_RANK2_" + TERM + "_T1").setAlt(SUIK_RANK2_DESC);
					    	eval("img_GIGAN_SUIK_RANK2_" + TERM + "_T1").setSrc("/dws/images/inc/icon_status_" + SUIK_RANK2_KEY + ".png");
					    	eval("img_GIGAN_SUIK_RANK2_" + TERM + "_T1").show("");
					    		 
					    	eval("txt_SILH_SUIK_RT_" + TERM + "_T1").setValue(dc_giganFundSuikList.getCellData(i, "SILH_SUIK_RT"));	// 실수익률
					    	eval("txt_BM_SUIK_RT_" + TERM + "_T1").setValue(dc_giganFundSuikList.getCellData(i, "BM_SUIK_RT"));		// 벤치마크수익률
					    }
					    
					    // [동일유형 내 수익률 비교] 동일유형 평균
					    var rowCount = dc_giganSuikList.getRowCount();
					    for (var i = 0; i < rowCount; i ++) {
					    	var TERM	  = dc_giganSuikList.getCellData(i, "TERM");
					    	var GIJUN_YMD = dc_giganSuikList.getCellData(i, "GIJUN_YMD");
					    	if (SUIK_GIJUN_YMD == "" && GIJUN_YMD != "")
					    		SUIK_GIJUN_YMD = GIJUN_YMD;
					    		
					    	eval("txt_TYPE_AVG_" + TERM + "_T1").setValue(dc_giganSuikList.getCellData(i, "TYPE_AVG"));				// 동일유형 평균
					    }
					    txt_SUIK_GIJUN_YMD.setValue(SUIK_GIJUN_YMD);
					    
					    // [동일유형 내 수익률 비교] 동일유형, 벤치마크
					    txt_BM_NM_T1.setValue("동일유형은 (" + dc_detailInfoMap.get("ZEROIN_TYPE_NM") + ") 이며, 벤치마크는 (" + dc_detailInfoMap.get("BM_NM") + ") 입니다.");
					    
					    // [자산현황] 기준일자, 국내주식,  해외주식, 국내채권,  해외채권, 펀드 , 유동성, 주식선물 순포지션, 채권선물 순포지션 
					    txt_AK_RT_GIJUN_YMD_T1.setValue(dc_appotionAkMap.get("GIJUN_YMD"));
					    txt_STOCK_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("STOCK_AK")));
						txt_STOCK_OTHER_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("STOCK_OTHER_AK")));
						txt_BOND_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("BOND_AK")));
						txt_BOND_OTHER_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("BOND_OTHER_AK")));
						txt_FUND_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("FUND_AK")));
						txt_CASH_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("CASH_AK")));
						txt_MESU_STOCK_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("MESU_STOCK")));
						txt_MESU_INTEREST_AK_T1.setValue(PageFunc.fn_nvlNum8(dc_appotionAkMap.get("MESU_INTEREST")));
						
						txt_STOCK_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("STOCK_RT")));
						txt_STOCK_OTHER_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("STOCK_OTHER_RT")));
						txt_BOND_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("BOND_RT")));
						txt_BOND_OTHER_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("BOND_OTHER_RT")));
						txt_FUND_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("FUND_RT")));
						txt_CASH_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("CASH_RT")));
						txt_MESU_STOCK_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("MESU_STOCK")));
						txt_MESU_INTEREST_RT_T1.setValue(PageFunc.fn_nvlNumPer(dc_appotionRtMap.get("MESU_INTEREST")));
					    
					    // [동일유형 내 평가] 표준편차, Sharpe Ratio, 젠센알파
					    var rowCount = dc_riskAnalysisList.getRowCount();
					    for (var i = 0; i < rowCount; i ++) {
						    var SECT	= dc_riskAnalysisList.getCellData(i, "SECT");
							var YIRT6	= dc_riskAnalysisList.getCellData(i, "YIRT6");
							if (i == 0)
								txt_YY_DEV_GIJUN_YMD_T1.setValue(dc_riskAnalysisList.getCellData(i, "GIJUN_YMD"));
							
							if (SECT == "01") {				// 표준편차
								txt_YY_DEV_1_T1.setValue(PageFunc.fn_nvlNumPer(YIRT6));
							} else if (SECT == "02") {		// 표준편차 (동일유형)
								txt_YY_DEV_2_T1.setValue(PageFunc.fn_nvlNumPer(YIRT6));
								
								var tVal1 = dc_riskAnalysisList.getCellData(i - 1, "YIRT6");
								var tVal2 = dc_riskAnalysisList.getCellData(i, "YIRT6");
								if (tVal1 != "" && tVal2 != "") {
									if (parseFloat(tVal1) - parseFloat(tVal1) <= 0) {
										img_YY_DEV_EVL_T1.setSrc("/dws/images/inc/icon_status_03.png");
										img_YY_DEV_EVL_T1.setAlt("나쁨");
										txt_YY_DEV_EVL_T1.setValue(" 나쁨");
									} else {
										img_YY_DEV_EVL_T1.setSrc("/dws/images/inc/icon_status_01.png");
										img_YY_DEV_EVL_T1.setAlt("양호");
										txt_YY_DEV_EVL_T1.setValue(" 양호");
									}
									img_YY_DEV_EVL_T1.show("");
								}
							} else if (SECT == "03") {		// Sharpe Ratio
								txt_SHARP_1_T1.setValue(PageFunc.fn_nvlNumPer(YIRT6));
							} else if (SECT == "04") {		// Sharpe Ratio (동일유형)
								txt_SHARP_2_T1.setValue(PageFunc.fn_nvlNumPer(YIRT6));
								
								var tVal1 = dc_riskAnalysisList.getCellData(i - 1, "YIRT6");
								var tVal2 = dc_riskAnalysisList.getCellData(i, "YIRT6");
								if (tVal1 != "" && tVal2 != "") {
									if (parseFloat(tVal1) - parseFloat(tVal1) <= 0) {
										img_SHARP_EVL_T1.setSrc("/dws/images/inc/icon_status_03.png");
										img_SHARP_EVL_T1.setAlt("나쁨");
										txt_SHARP_EVL_T1.setValue(" 나쁨");
									} else {
										img_SHARP_EVL_T1.setSrc("/dws/images/inc/icon_status_01.png");
										img_SHARP_EVL_T1.setAlt("양호");
										txt_SHARP_EVL_T1.setValue(" 양호");
									}
									img_SHARP_EVL_T1.show("");
								}
							} else if (SECT == "05") {		// 젠센알파
								txt_ALPHA_MKT_1_T1.setValue(PageFunc.fn_nvlNumPer(YIRT6));
							} else if (SECT == "06") {		// 젠센알파 (동일유형)
								txt_ALPHA_MKT_2_T1.setValue(PageFunc.fn_nvlNumPer(YIRT6));
								
								var tVal1 = dc_riskAnalysisList.getCellData(i - 1, "YIRT6");
								var tVal2 = dc_riskAnalysisList.getCellData(i, "YIRT6");
								if (tVal1 != "" && tVal2 != "") {
									if (parseFloat(tVal1) - parseFloat(tVal1) <= 0) {
										img_ALPHA_MKT_EVL_T1.setSrc("/dws/images/inc/icon_status_03.png");
										img_ALPHA_MKT_EVL_T1.setAlt("나쁨");
										txt_ALPHA_MKT_EVL_T1.setValue(" 나쁨");
									} else {
										img_ALPHA_MKT_EVL_T1.setSrc("/dws/images/inc/icon_status_01.png");
										img_ALPHA_MKT_EVL_T1.setAlt("양호");
										txt_ALPHA_MKT_EVL_T1.setValue(" 양호");
									}
									img_ALPHA_MKT_EVL_T1.show("");
								}
							}  
					    }
					    
		    			// [주요자산 투자한도] 총 주식, 총 채권, 유동성, 수익증권, 기타자산
						txt_TOTALIVST_T1.setValue("-");
					    txt_TOTALBOND_T1.setValue("-");
					    txt_TOTALCASH_T1.setValue("-");
					    txt_TOTALSUIK_T1.setValue("-");
					    txt_TOTALETC_T1.setValue("-");
					    		
						var rowCount = dc_ivstRTList.getRowCount();
					    for (var i = 0; i < rowCount; i ++) {
					    	var IVST_OBJ_CD = dc_ivstRTList.getCellData(i, "IVST_OBJ_CD");							// 투자대상구분코드
					    	var MIN_IVST_RT = (Math.floor(parseFloat(dc_ivstRTList.getCellData(i, "MIN_IVST_RT")) * 100) / 100);	// 최소투자비율
					    	var MAX_IVST_RT = (Math.floor(parseFloat(dc_ivstRTList.getCellData(i, "MAX_IVST_RT")) * 100) / 100);	// 최대투자비율
					    	var result = MIN_IVST_RT + "% ~ " +  MAX_IVST_RT + "%";
					    	if (IVST_OBJ_CD == "FB10") {			// 총 주식
					    		txt_TOTALIVST_T1.setValue(result);
					    	} else if (IVST_OBJ_CD == "FB20") {		// 총 채권
					    		txt_TOTALBOND_T1.setValue(result);
					    	} else if (IVST_OBJ_CD == "FB31") {		// 유동성
					    		txt_TOTALCASH_T1.setValue(result);
					    	} else if (IVST_OBJ_CD == "FB32") {		// 수익증권
					    		txt_TOTALSUIK_T1.setValue(result);
					    	} else if (IVST_OBJ_CD == "FB33") {		// 기타자산
					    		txt_TOTALETC_T1.setValue(result);
					    	}
					    }
					    
					    // ********** [차트정보] **********
						
						PageFunc.fn_yirtChartDateT1(PageParam.b1month);	// [수익률 추이] 차트 데이터 조회 시작
		    			break;
		    		
		    		case "selectTop3SuikRT":			// 동일 유형내 수익률 상위 펀드 목록 조회
		    			for (var i = 0; i < 3; i++) {
		    				var objFUND_FNM = eval("txt_FUND_FNM_B" + i); 
							objFUND_FNM.setValue("[펀드정보 없음]");
							objFUND_FNM.setUserData("ITEM_CD", "");
							objFUND_FNM.setStyle("cursor", "default");
							
							eval("txt_SILH_SUIK_RT_B" + i).setValue('');
							window["txt_SILH_SUIK_RT_B" + i + '_PERCENT'].setValue('');
		    			}
		    			
		    			var rowCount = dc_top3SuikRTList.getRowCount();
		    			for (var i = 0; i < rowCount; i++) {
		    				var ITEM_CD		 = dc_top3SuikRTList.getCellData(i, "ITEM_CD");
							var FUND_FNM	 = dc_top3SuikRTList.getCellData(i, "FUND_FNM");
							var SILH_SUIK_RT = dc_top3SuikRTList.getCellData(i, "SILH_SUIK_RT");
							
							var objFUND_FNM = eval("txt_FUND_FNM_B" + i);
							objFUND_FNM.setValue(FUND_FNM);
							objFUND_FNM.setUserData("ITEM_CD", ITEM_CD);
							objFUND_FNM.setStyle("cursor", "pointer");
							eval("txt_SILH_SUIK_RT_B" + i).setValue(SILH_SUIK_RT);
							var silhSuikRt = parseFloat(SILH_SUIK_RT);
							window["txt_SILH_SUIK_RT_B" + i].addClass(silhSuikRt > 0 ? 'high' : (silhSuikRt < 0 ? 'low' : ''));
							window["txt_SILH_SUIK_RT_B" + i + '_PERCENT'].setValue('%');
							window["txt_SILH_SUIK_RT_B" + i + '_PERCENT'].addClass(silhSuikRt > 0 ? 'high' : (silhSuikRt < 0 ? 'low' : ''));
		    			}
						
		    			break;
		    		
		    		case "selectTop3Fvr":				// 이 펀드를 조회한 고객님들이 본 상위펀드 목록 조회
		    			for (var i = 0; i < 3; i++) {
		    				var objITEM_NM = eval("txt_ITEM_NM_B" + i); 
							objITEM_NM.setValue("[펀드정보 없음]");
							objITEM_NM.setUserData("ITEM_CD", "");
							objITEM_NM.setStyle("cursor", "default");
							
							eval("txt_MMS3_YIRT_B" + i).setValue('');
							window["txt_MMS3_YIRT_B" + i + '_PERCENT'].setValue('');
		    			}
		    			
		    			var rowCount = dc_top3FvrList.getRowCount();
		    			for (var i = 0; i < rowCount; i++) {
		    				var ITEM_CD		= dc_top3FvrList.getCellData(i, "ITEM_CD");
							var ITEM_NM	 	= dc_top3FvrList.getCellData(i, "ITEM_NM");
							var MMS3_YIRT	= dc_top3FvrList.getCellData(i, "MMS3_YIRT");
							
							var objITEM_NM = eval("txt_ITEM_NM_B" + i);
							objITEM_NM.setValue(ITEM_NM);
							objITEM_NM.setUserData("ITEM_CD", ITEM_CD);
							objITEM_NM.setStyle("cursor", "pointer");
							
							eval("txt_MMS3_YIRT_B" + i).setValue(MMS3_YIRT);
							var mms3Yirt = parseFloat(MMS3_YIRT);
							window["txt_MMS3_YIRT_B" + i].addClass(mms3Yirt > 0 ? 'high' : (mms3Yirt < 0 ? 'low' : ''));
							window["txt_MMS3_YIRT_B" + i + '_PERCENT'].setValue('%');
							window["txt_MMS3_YIRT_B" + i + '_PERCENT'].addClass(mms3Yirt > 0 ? 'high' : (mms3Yirt < 0 ? 'low' : ''));
		    			}
		    			break;
		    			
		    		case "selectAfterLoginInfo":		// 로그인 후처리 정보 조회
		    			// [투자위험] 로그인 여부에 따른 투자성향 처리
						if (response.userName == "") {
							txt_cPatternNm_T0.setValue("고객님의 투자성향 : ");
							txt_cPatternTy_T0.setValue("[비로그인 중]");
							btn_cPattern_T0.setValue("로그인");
							btn_cPattern_T0.setUserData("type", "login");
							
							btn_concern.setUserData("type", "login");
							btn_concern2.setUserData("type", "login");
						} else {
							DWSAjax.post("/mkt/mkt3/mkt3001j04/selectAfterLoginInfo.do", null, function(response) {
								txt_cPatternNm_T0.setValue(response.userName + "님의 투자성향 : ");
								txt_cPatternTy_T0.setValue(response.dc_a11oia5Data.o_IvstTrndClas);
							});
							btn_cPattern_T0.setValue("변경");
							btn_cPattern_T0.setUserData("type", "change");
							
							btn_concern.setUserData("type", "regist");
							btn_concern2.setUserData("type", "regist");
						}
		    			break;
		    				
		    		default :
		    			break;
		    	}
		    };
		    
		    // [최근 3개월 수익률 추이] 차트 데이터 조회 후 후처리
		    PageFunc.fn_callBackChart = function(val, response, chartJson) {
		    	var anchorradius = btn_fc1Month_T1.hasClass("on") ? "3" : "2";
		    	switch (val) {
		    		case "yirt3_dates":		// [최근 3개월 수익률 추이] 카테고리 목록 (날짜) 설정
		    		case "otxt_dates":		// [펀드규모 추이] 카테고리 목록 (날짜) 설정
		    		case "yirt_dates":		// [수익률 추이] 카테고리 목록 (날짜) 설정
		    			chartJson.categories[0].category = response.dateList;
		    			break;
		    			
		    		case "yirt3_data":		// [최근 3개월 수익률 추이] 데이터 영역 추가
		    		case "otxt_data":		// [펀드규모 추이] 데이터 영역 추가
		    			chartJson.dataset.push({
		        			seriesname: response.itemNm,
		        			anchorradius: "2",
		        			data: []
		        		});
		    			chartJson.dataset[chartJson.dataset.length - 1].data = response.dataList;
						break;
						
					case "yirt_data":		// [수익률 추이] 데이터 영역 추가
			    		chartJson.dataset.push({
		        			seriesname: response.itemNm,
		        			anchorradius: anchorradius,
		        			data: []
		        		});
		    			chartJson.dataset[chartJson.dataset.length - 1].data = response.dataList;
		    			
		    			// 펀드비교 팝업 지수 데이터 설정
				    	var indexs		   = cbx_chart_T1.getSelectedIndex(",");
				    	var categoryLength = chartJson.categories[0].category.length;
				    	if (indexs != "" && categoryLength > 0 && chartJson.dataset.length > 0) {
				    		DWSAjax.post("/mkt/mkt3/mkt3001p01/selectChartSubInfoAll.do", 
								{
									keys: cbx_chart_T1.getValue(","),
									baseDate: PageParam.today,
									dataCount: categoryLength.toString()
								}, 
				        		function(response) {
				        			PageFunc.fn_callBackChart("yirt_subData", response, chartJson);
				        		});
				    	}
						break;
						
					case "yirt_subData":	// [수익률 추이] 지수 데이터 영역 추가
		    			var indexsList	= cbx_chart_T1.getSelectedIndex(",").split(",");
		    			var subList		= response.dc_chartSubInfoList;
		    			
		    			for (var i = 0; i < subList.length; i++) {
		    				var label = cbx_chart_T1.itemArr[indexsList[i]].label;
		    				chartJson.dataset.push({
			        			seriesname: label,
			        			anchorradius: anchorradius,
			        			color: PageParam.colorArr[parseInt(indexsList[i], 10) + 3],
			        			dashed: "1",
			        			lineDashLen: "15",
			        			data: []
			        		});
			        		chartJson.dataset[chartJson.dataset.length - 1].data = subList[i];
		    			}
						break;
							
		    		default:
		    			break;
		    	}
		    	
		    	var labelStepCnt = 0;
		    	if (chartJson.dataset.length > 0)
		    		labelStepCnt = parseInt(chartJson.dataset[0].data.length / 2, 10) - 1;
		    	
		    	if ((val == "yirt3_dates" || val == "yirt3_data") &&
		    		chartJson.categories[0].category.length > 0 && chartJson.dataset.length > 0) {	// [최근 3개월 수익률 추이] 차트 렌더링
					charYirt3_T0.setChartAttribute({ numberSuffix: " %", labelStep: labelStepCnt, yAxisValuesPadding: 7 });
					charYirt3_T0.setJSONData(chartJson);
		    	} else if ((val == "otxt_dates" || val == "otxt_data") &&
		    		chartJson.categories[0].category.length > 0 && chartJson.dataset.length > 0) {	// [펀드규모 추이] 차트 렌더링
		    		charOtxt_T0.setChartAttribute({ numberSuffix: " 억", labelStep: labelStepCnt, yAxisValuesPadding: 7 });
					charOtxt_T0.setJSONData(chartJson);
		    	} else if (val == "yirt_dates" || val == "yirt_data" || val == "yirt_subData") {	// [수익률 추이] 차트 렌더링
		    		// 지수 선택여부
			    	var subValues = cbx_chart_T1.getValue();
			    	var subLength = 0;
			    	if (subValues != "") {
			    		subLength = cbx_chart_T1.getSelectedIndex(",").split(",").length;
			    	}
			    	
		    		if (chartJson.categories[0].category.length > 0 && chartJson.dataset.length == subLength + 1) {	
			    		charYirt_T1.applyStyle("font", "font", { size : 12, bold : 0 }, ["legend"]);
						charYirt_T1.setChartAttribute({ numberSuffix: " %", labelStep: labelStepCnt, yAxisValuesPadding: 7 });
						charYirt_T1.setJSONData(chartJson);
					}
		    	}
		    };
		    
		    // 주식종목 조회 팝업 콜백 함수
		    PageFunc.fn_setStockCode = function(stcd, stcdNm, mktCd) {
		    	PageFunc.fn_appendChartItemT1(stcdNm, stcd);
		    };
		    
		    // 주식종목 항목 추가
		    PageFunc.fn_appendChartItemT1 = function(name, value) {
		    	var itemCount = cbx_chart_T1.getItemCount();
		    	
		    	if (itemCount > 5) {	// 이미 주식종목이 추가된 경우, 제거함
		    		var objDeleted = cbx_chart_T1.deleteItem(5);
		    		
		    		// 차트 데이터에서 해당 데이터를 제거한다.
		    		var chartJson  = charYirt_T1.fc().getJSONData();
		    		var newDataset = [];
		    		var count = chartJson.dataset.length;
		    		for (var i = 0; i < count; i++) {
		    			if (chartJson.dataset[i].seriesname != objDeleted.label) {
		    				newDataset.push(chartJson.dataset[i]);
		    			} 
		    		}
		    		
		    		if (count > newDataset.length) {
			    		chartJson.dataset = newDataset;
			    		charYirt_T1.fc().setJSONData(chartJson);
		    		}
		    	}

				// 새로운 항목을 등록함
		    	cbx_chart_T1.addItem(value, name);
		    	setTimeout(function() {
		    		cbx_chart_T1.setSelectedIndex(5);
		    		PageFunc.fn_selectChartSubInfoT1(5, value, true);
		    	}, 500);
		    };
		    
		    // 관심상품 등록
		    PageFunc.fn_insertMyGoods = function() {
		    	DWSAjax.post("/mkt/mkt7/mkt7001m01/insertMyGoods.do", {
		    			ITEM_CD: PageParam.itemCd,
                 		TYPE_CD: "03"
		    		}, function(response) {
		    			if (response.insertResult) {
			    			if (confirm("관심상품으로 등록되었습니다. 관심상품 페이지로 이동하시겠습니까?")) {
			    				dwsCommon.movePage("/dws/view/mkt/mkt7/mkt7001m01.do", { tabIndex: "1" });
								window.scrollTo(0, 0);
			    			}
			    		} else {
			    			alert("이미 관심상품으로 등록된 상품입니다.");
			    		}
		    		});	
		    };
		    
		    // 매수 페이지로 이동
		    PageFunc.fn_movePurchase = function(itemCd) {
		    	var options = {
					param : { 
						itemCd: itemCd,
						from: "mkt3001m04" 
					}
				};
				dwsCommon.movePage("/dws/view/mkt/mkt3/mkt3002m01.do", options);
				window.scrollTo(0, 0);
		    };
		    
		    // 위험도 아이콘 이미지 URL
		    PageFunc.fn_riskKey = function(code) {
		    	if (code == "01") {				// 초고위험
					return "01";
				} else if (code == "02") {		// 고위험
					return "01";
				} else if (code == "03") {		// 중위험
					return "02";
				} else if (code == "04") {		// 저위험
					return "02";
				} else if (code == "05") {		// 초저위험
					return "03";
				} else {
					return "03";
				}
		    };
		    
		    // 빈 문자열 처리
		    PageFunc.fn_nvlNum8 = function(source) {
		    	if (typeof source == "undefined" || source == null || isNaN(source) || source == "" || source === 0) {
		    		return "-";
		    	} else {
		    		return (Math.floor((parseFloat(source) / 100000000) * 100) / 100).formatByComma();
		    	}
		    };
		    
		    // 빈 문자열 처리
		    PageFunc.fn_nvlNumPer = function(source) {
		    	if (typeof source == "undefined" || source == null || isNaN(source) || source == "" || source === 0) {
		    		return "-";
		    	} else {
		    		return  (Math.floor(parseFloat(source) * 100) / 100).formatByComma();
		    	}
		    };
		    
		    // 사용자 정의 툴팁 처리
		    PageFunc.fn_showTooltip = function(srcId) {
		    	if (srcId == "grp_toolTip0") {
			    	grp_toolTip0.show();
			    	grp_toolTip1.hide();
			    	grp_toolTip2.hide();
		    	} else if (srcId == "grp_toolTip1") {
			    	grp_toolTip0.hide();
			    	grp_toolTip1.show();
			    	grp_toolTip2.hide();
		    	} else if (srcId == "grp_toolTip2") {
			    	grp_toolTip0.hide();
			    	grp_toolTip1.hide();
			    	grp_toolTip2.show();
		    	} else {
		    		grp_toolTip0.hide();
			    	grp_toolTip1.hide();
			    	grp_toolTip2.hide();
		    	}
		    };
		    
		    // 상품문의 메시지
		    PageFunc.fn_showMsg = function() {
		    	alert(PageParam.msg);
		    };
		    
		    PageFunc.fn_init();
		