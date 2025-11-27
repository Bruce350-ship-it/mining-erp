export type PermissionKey = string;

export type RoleWithPermissions = {
	name: string;
	permissions: PermissionKey[];
};

export function hasPermission(
	userPermissions: PermissionKey[],
	required: PermissionKey | PermissionKey[]
): boolean {
	const requiredList = Array.isArray(required) ? required : [required];
	return requiredList.every((perm) => userPermissions.includes(perm));
}

export function anyPermission(
	userPermissions: PermissionKey[],
	required: PermissionKey | PermissionKey[]
): boolean {
	const requiredList = Array.isArray(required) ? required : [required];
	return requiredList.some((perm) => userPermissions.includes(perm));
}

