import {createAction} from 'redux-actions';
import * as teacherService from '../service/teacher';

const {
	GET_CHECK_LIST,
	TEACHER_GET,
	TEACHER_INFO,
	TEACHER_REMOVE,
	TEACHER_PUBLISH,
	TEACHER_UPDATE,
	TEACHER_RECOMM,
	
	TEACHER_RANK,
	TEACHER_APPLY,
	TEACHER_APPLY_PUBLISH,
	TEACHER_APPLY_ACTION,
	TEACHER_APPLY_SETTING,
	TEACHER_APPLY_SETTING_PUBLISH,

	TEACHER_LEVEL_GET,
	TEACHER_LEVEL_CHANGE,

	TEACHER_APPLY_IMPORT,
	TEACHER_APPLY_EXPORT,
	IMPORT_TEACHER_COURSE_DATA,
	GET_USER_BY_SN,
	TEACHERS_GET,
	TEACHERSHENG_RECOMM,
	TEACHERBIND_POST,
	TEACHERINOFS_GET,
} = require('../key').default;

export const getUserBySn = createAction(GET_USER_BY_SN, teacherService.getUserBySn, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const importTeacherCourseData = createAction(IMPORT_TEACHER_COURSE_DATA, teacherService.importTeacherCourseData, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getCheckList = createAction(GET_CHECK_LIST, teacherService.getCheckList, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const exportTeacherApply = createAction(TEACHER_APPLY_EXPORT, teacherService.exportTeacherApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const importTeacherApply = createAction(TEACHER_APPLY_IMPORT, teacherService.importTeacherApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
////
export const changeTeacherLevel = createAction(TEACHER_LEVEL_CHANGE, teacherService.changeTeacherLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const actionTeacherLevel = createAction('actionTeacherLevel', teacherService.actionTeacherLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const setTeacherLevel = createAction('setTeacherLevel', teacherService.setTeacherLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getTeacherLevel = createAction(TEACHER_LEVEL_GET, teacherService.getTeacherLevel, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getApplySetting = createAction(TEACHER_APPLY_SETTING, teacherService.getApplySetting, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const publishApplySetting = createAction(TEACHER_APPLY_SETTING_PUBLISH, teacherService.publishApplySetting, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const actionTeacherApply = createAction(TEACHER_APPLY_ACTION, teacherService.actionTeacherApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const setTeacherApply = createAction(TEACHER_APPLY_PUBLISH, teacherService.setTeacherApply, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getTeacherRank = createAction(TEACHER_RANK, async(prams) => {
	const data = await teacherService.getTeacherApply(prams);
	return data;
}, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});

export const getTeacherApply = createAction(TEACHER_APPLY, async(prams) => {
	const data = await teacherService.getTeacherApply(prams);
	return data;
}, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
/////
export const searchTeacher = createAction(TEACHER_GET, teacherService.getTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeacher = createAction(TEACHER_GET, async({wtype,keyword, page,pageSize,level}) => {
	const data = await teacherService.getTeacher({wtype,keyword, page,pageSize,level});
	return data;
});
export const getTeachers = createAction(TEACHERS_GET, async({wtype,keyword, page,pageSize,level,status}) => {
	const data = await teacherService.getTeachers({wtype,keyword, page,pageSize,level,status});
	return data;
});
export const getTeacherInfo = createAction(TEACHER_INFO, async(id) => {
	const data = await teacherService.getTeacherInfo(id);
	return data;
});
export const getTeacherInfos = createAction(TEACHERINOFS_GET, teacherService.getTeacherInfos, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateTeacher = createAction(TEACHER_UPDATE, teacherService.updateTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const updateTeachers = createAction('teacher_updates', teacherService.updateTeachers, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const publishTeacher = createAction(TEACHER_PUBLISH, teacherService.publishTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const removeTeacher = createAction(TEACHER_REMOVE, teacherService.removeTeacher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const recommonTecher = createAction(TEACHER_RECOMM, teacherService.recommonTecher, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const getTeacherSheng = createAction(TEACHERSHENG_RECOMM, teacherService.getTeacherSheng, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});
export const postTeacherBind = createAction(TEACHERBIND_POST, teacherService.postTeacherBind, ({resolved, rejected}) => {
	return {
		resolved,
		rejected
	}
});