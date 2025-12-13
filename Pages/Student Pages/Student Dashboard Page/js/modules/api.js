
// ========================================
// API MODULE
// ========================================

/**
 * Fetch generic student information
 * @param {Number} studentId 
 * @returns {Promise<Object>}
 */
export async function fetchStudentInfoAPI(studentId) {
    const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_information.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
    });
    return await response.json();
}

/**
 * Fetch application counts
 * @param {Number} studentId 
 * @returns {Promise<Object>}
 */
export async function fetchApplicationCountsAPI(studentId) {
    console.log('[Dashboard] Fetching application counts for student ID:', studentId);
    const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_application_counts.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
    });
    return await response.json();
}

/**
 * Search/Fetch recommended jobs
 * @param {Array} tags 
 * @returns {Promise<Object>}
 */
export async function fetchRecommendedJobsAPI(tags) {
    const response = await fetch('http://mrnp.site:8080/Hirenorian/API/companyDB_APIs/search_jobs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            career_tags: tags,
            courses: [],
            location: null,
            work_type: null,
            keyword: null
        })
    });
    return await response.json();
}

/**
 * Fetch student application history
 * @param {Number} studentId 
 * @returns {Promise<Object>}
 */
export async function fetchApplicationHistoryAPI(studentId) {
    const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_student_applications.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ student_id: studentId })
    });
    return await response.json();
}

/**
 * Fetch audit/activity logs
 * @param {Number} studentId 
 * @param {Number} limit 
 * @returns {Promise<Object>}
 */
export async function fetchAuditLogsAPI(studentId, limit = 20) {
    const response = await fetch('http://mrnp.site:8080/Hirenorian/API/studentDB_APIs/fetch_audit_logs.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            student_id: studentId,
            limit: limit
        })
    });
    return await response.json();
}
