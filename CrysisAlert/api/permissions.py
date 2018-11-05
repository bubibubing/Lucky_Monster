from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
	"""User defined permission class. Permits the owner or read-only operations
	"""

	def has_object_permission(self, request, view, obj):
		if request.user.is_superuser:
			return True

		if request.method in permissions.SAFE_METHODS:
			return True

		return obj.creator == request.user